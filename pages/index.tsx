import {
  ConnectWallet,
  darkTheme,
  useAddress,
  useAuth,
  useUser,
} from "@thirdweb-dev/react";
import React, { useEffect } from "react";
import initializeFirebaseClient from "../firebase/initFirebase";
import useFirebaseUser from "../firebase/useFirebaseUser";
import useFirebaseDocument from "../firebase/useFirebaseUserDocument";
import { useRouter } from "next/router";
import {
  checkTwitterHandleExistsClientSide,
  signIn,
} from "../firebase/firebaseClientFunctions";
import initializeFirebaseServer from "../firebase/initFirebaseAdmin";
import { GetServerSidePropsContext } from "next";
import { checkTwitterHandle, verifyAuthentication } from "../utils/authUtils";

export default function Login() {
  const thirdwebAuth = useAuth();
  const address = useAddress();
  const { auth, db } = initializeFirebaseClient();
  const { user, isLoading: loadingAuth } = useFirebaseUser();
  const { document, isLoading: loadingDocument } = useFirebaseDocument();
  const { isLoading, user: thirdWebUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleThirdWebUser = async () => {
      if (thirdWebUser && thirdWebUser?.session) {
        console.log("thirdWebUser", thirdWebUser);
        try {
          const session = thirdWebUser.session as { firtoken: string };


          await signIn(session?.firtoken, auth, db);
          //check if twitter handle exists
          const twitterHandleExists = await checkTwitterHandleExistsClientSide(
            db,
            thirdWebUser?.address
          );
          if (twitterHandleExists) {
            console.log("twitterHandleExists", twitterHandleExists);
            // router.push("/profile");
          } else {
            // router.push("/twitterauth");
          }
        } catch (error) {
          console.error(error);
          // Display an alert with the error message
        }
      }
    };

    handleThirdWebUser();
  }, [thirdWebUser]);

  return (
    <div className="flex flex-col items-center bg-white w-full h-full justify-between rounded-md">
      <div className="flex flex-col items-center justify-center w-full mt-14">
        <img src="/logo.png" alt="Logo" width="110" height="110" />
        <h1 className="text-sm font-medium text-gray-500">
          Attach value to every message
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-2 mb-6">
        <ConnectWallet
          style={{
            minWidth: "200px",
            borderRadius: "100px",
          }}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "#A873E8",
              primaryButtonText: "#FFFFFF",
            },
          })}
          auth={{
            loginOptional: false,
          }}
          modalSize="compact"
          btnTitle={"Sign in"}
        />
        <div className="w-1/2 h-1/2 flex justify-center items-center text-sm">
          Privacy Policy
        </div>
      </div>
    </div>
  );
}



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { db } = initializeFirebaseServer();
    const user = await verifyAuthentication(ctx);

    if (!user) {
      return { props: {} };
    }

    const twitterHandleExists = await checkTwitterHandle(db, user.address);

    if (user && twitterHandleExists) {
      return {
        redirect: {
          destination: "/profile",
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/twitterauth",
          permanent: false,
        },
      };
    }
  } catch (err) {
    return { props: {} };
  }
};
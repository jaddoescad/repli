import {
  getProviders,
  signIn,
  useSession,
  ClientSafeProvider,
} from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@thirdweb-dev/react";
import { TwitterExtendedUser } from "../types/types";
import { saveTwitterInfoInFirestore } from "../firebase/firebaseClientFunctions";
import initializeFirebaseClient from "../firebase/initFirebase";
import useFirebaseUser from "../firebase/useFirebaseUser";
import initializeFirebaseServer from "../firebase/initFirebaseAdmin";
import { checkTwitterHandle, verifyAuthentication } from "../utils/authUtils";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

export default function SignIn({
  providers: providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isLoading, user: thirdWebUser } = useUser();
  const { db } = initializeFirebaseClient();
  const { user: firUser, isLoading: loadingAuth } = useFirebaseUser();

  // useEffect(() => {
  //   async function saveTwitterNameAndRedirect() {
  //     if (session && thirdWebUser?.address) {
  //       const user = session.user as TwitterExtendedUser;
  //       console.log("starting");

  //       if (user && user.username && user.name && user.id && firUser) {
  //         console.log("saving");

  //         try {
  //           await saveTwitterInfoInFirestore(db, firUser, user);
  //           // Redirect to /profile page if saving to Firestore is successful
  //           router.push("/profile");
  //         } catch (error) {
  //           // Display an alert if there is an error saving to Firestore
  //           alert("Error saving Twitter handle in Firestore");
  //           console.error(error);
  //         }
  //       }
  //     }
  //   }

  //   saveTwitterNameAndRedirect();
  // }, [session, router, thirdWebUser]);

  return (
    <div className="flex flex-col items-center bg-white w-full h-full justify-between rounded-md">
      <div className="flex flex-col items-center justify-center w-full mt-14">
        <img src="/logo.png" alt="Logo" width="110" height="110" />
        <h1 className="text-sm font-medium text-gray-500">
          Attach value to every message
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-2 mb-6">
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="m-4">
            <button
              className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out
              ${
                provider.name === "Twitter"
                  ? "bg-blue-400 hover:bg-blue-500"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              onClick={async () => {
                if (thirdWebUser?.address) {
                  //set cookie using nookies save address
                  nookies.set(
                    null,
                    "authParams",
                    JSON.stringify({
                      address: thirdWebUser?.address,
                    }),
                    {
                      path: "/",
                      maxAge: 30 * 24 * 60 * 60,
                      sameSite: "lax",
                    }
                  );

                  const res = await signIn(
                    provider.id,
                    {
                      callbackUrl: `${window.location.origin}/profile`,
                    },
                    {
                      address: thirdWebUser?.address,
                    }
                  );
                } else {
                  router.push("/");
                }
              }}
            >
              Link your {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const providers = await getProviders();
    const { db } = initializeFirebaseServer();
    const user = await verifyAuthentication(ctx);

    if (!user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const twitterHandleExists = await checkTwitterHandle(db, user.address);

    if (twitterHandleExists) {
      return {
        redirect: {
          destination: "/profile",
          permanent: false,
        },
      };
    } else {
      return { props: { providers } };
    }
  } catch (err) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}


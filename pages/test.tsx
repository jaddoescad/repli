import {
  ConnectWallet,
  darkTheme,
  useUser,
} from "@thirdweb-dev/react";
import { GetServerSideProps, NextPage } from "next";
import { getUser } from "./api/twauth/[...thirdweb]";
import { checkTwitterHandle } from "../supabase/supabaseFunctions";
import { createSupabaseServer } from "../supabase/createSupabaseServer";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  return (
    <>
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
            onLogin: () => {
              router.push("/verify-twitter");
            },
          }}
          modalSize="compact"
          btnTitle={"Sign in"}
        />
        <div className="w-1/2 h-1/2 flex justify-center items-center text-sm">
          Privacy Policy
        </div>
      </div>
    </>
  );
};

export default Home;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const user = await getUser(context.req); // Implement this function as needed
//   const supabaseServer = createSupabaseServer();

//   if (!user || !user.address) {
//     return {
//       props: {}, // Return empty props if not authenticated
//     };
//   }

//   const checkTwitterHandleResult = await checkTwitterHandle(
//     user?.address,
//     supabaseServer
//   );

//   if (
//     user?.session.supabaseToken &&
//     !checkTwitterHandleResult?.[0]?.twitterHandle
//   ) {
//     return {
//       redirect: {
//         destination: "/verify-twitter", // Redirect to home if authenticated
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {}, // Return empty props if not authenticated
//   };
// };

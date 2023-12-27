// import { createContext, useContext, useEffect, useState } from "react";
// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import {
//   ConnectWallet,
//   UserWithData,
//   darkTheme,
//   useUser,
// } from "@thirdweb-dev/react";
// import { GetServerSideProps, NextPage } from "next";
// import { getUser } from "./api/twauth/[...thirdweb]";
// import { useSupabaseClient } from "../hooks/supabaseClient";
// import { checkTwitterHandle } from "../supabase/supabaseFunctions";
// import { createSupabaseServer } from "../supabase/createSupabaseServer";

// // Context for Supabase client
// const SupabaseContext = createContext(null);

// // Main component
// const Home: NextPage = () => {
//   const { isLoading, user } = useUser();
//   const supabaseClient = useSupabaseClient(user);

//   return (
//     <SupabaseContext.Provider value={supabaseClient}>
//       <main className="flex justify-center items-center w-full h-screen bg-gray-200">
//         <div className="flex flex-col items-center bg-white w-full h-full max-h-[550px] max-w-[310px] justify-between">
//           <div className="flex flex-col items-center justify-center w-full mt-14">
//             <img src="/logo.png" alt="Logo" width="110" height="110" />
//               <h1 className="text- font-medium text-gray-500">
//                 Attach value to every message
//               </h1>
//             </div>

//           <div className="">
//             <ConnectWallet
//               style={{
//                 minWidth: "200px",
//                 //make button rounded
//                 borderRadius: "100px",
//               }}
//               theme={darkTheme({
//                 colors: {
//                   primaryButtonBg: "#A873E8",
//                   primaryButtonText: "#FFFFFF",
//                 },
//               })}
//               modalSize="compact"
//               btnTitle={"Sign in"}
//             />
//             <div className="flex flex-col items-center justify-center w-full gap-3">
//               Privacy Policy
//             </div>
//           </div>
//         </div>
//       </main>
//     </SupabaseContext.Provider>
//   );
// };

// export default Home;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Retrieve the user's session from cookies or another method
//   console.log("user");

//   const user = await getUser(context.req); // Implement this function as needed
//   const supabaseServer = createSupabaseServer();
//   const checkTwitterHandleResult = await checkTwitterHandle(
//     user?.address,
//     supabaseServer
//   );

//   console.log(
//     "checkTwitterHandleResult",
//     checkTwitterHandleResult?.[0]?.twitterHandle
//   );
//   if (
//     user?.session.supabaseToken &&
//     !checkTwitterHandleResult?.[0]?.twitterHandle
//   ) {
//     return {
//       redirect: {
//         destination: "/", // Redirect to home if authenticated
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {}, // Return empty props if not authenticated
//   };
// };

// const Home: NextPage = () => {
//   const { isLoading, user } = useUser();
//   const supabaseClient = useSupabaseClient(user);

//   return (
//     <SupabaseContext.Provider value={supabaseClient}>
//       <main className="flex justify-center items-center w-full h-screen bg-gray-200">
//         <div className="flex flex-col items-center justify-center bg-white w-full h-full max-h-[550px] max-w-[310px]">
//           <div className="flex flex-col items-center justify-center w-full gap-3 ">
//             <img src="/logo.png" alt="Logo" width="130" height="130" />{" "}
//             <h1 className="text-xl font-medium">
//               Attach value to every message
//             </h1>
//           </div>

//           <div className="flex flex-col items-center justify-center w-full gap-3">
//             <ConnectWallet
//               style={{
//                 minWidth: "200px",
//                 //make button rounded
//                 borderRadius: "100px",
//               }}
//               theme={darkTheme({
//                 colors: {
//                   primaryButtonBg: "#A873E8",
//                   primaryButtonText: "#FFFFFF",
//                 },
//               })}
//               modalSize="compact"
//               btnTitle={"Sign in"}
//             />
//             <div className="w-1/2 h-1/2 flex justify-center items-center text-sm">
//               Privacy Policy
//             </div>
//           </div>
//         </div>
//       </main>
//     </SupabaseContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  ConnectWallet,
  UserWithData,
  darkTheme,
  useUser,
} from "@thirdweb-dev/react";
import { GetServerSideProps, NextPage } from "next";
import { getUser } from "./api/twauth/[...thirdweb]";
import { checkTwitterHandle } from "../supabase/supabaseFunctions";
import { createSupabaseServer } from "../supabase/createSupabaseServer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";


const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const SupabaseContext = createContext(null);
  
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Retrieve the user's session from cookies or another method
  console.log("user");

  const user = await getUser(context.req); // Implement this function as needed
  const supabaseServer = createSupabaseServer();
  const checkTwitterHandleResult = await checkTwitterHandle(
    user?.address,
    supabaseServer
  );

  console.log(
    "checkTwitterHandleResult",
    checkTwitterHandleResult
  );


  if (
    user?.session.supabaseToken &&
    !checkTwitterHandleResult?.[0]?.twitterHandle
  ) {
    return {
      redirect: {
        destination: "/verify-twitter", // Redirect to home if authenticated
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Return empty props if not authenticated
  };
};

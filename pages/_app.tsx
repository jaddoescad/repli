import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  en,
  smartWallet,
  useUser,
} from "@thirdweb-dev/react";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/globals.css";
import { ACCOUNT_FACTORY_ADDRESS } from "../constants/addresses";
import { UserSupabaseProvider } from "../provider/UserSupabaseProvider";

// Supabase context
const SupabaseContext = createContext(null);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThirdwebProvider
        activeChain="mumbai"
        clientId="8b7e2a4791eb4838a97eaba1ea697fee"
        locale={en()}
        authConfig={{
          authUrl: "/api/twauth",
          domain: "http://127.0.0.1:3000",
        }}
        supportedWallets={[
          smartWallet(
            embeddedWallet({
              auth: {
                options: ["email", "google", "apple", "facebook"],
              },
            }),
            {
              factoryAddress: ACCOUNT_FACTORY_ADDRESS,
              gasless: true,
            }
          ),
        ]}
      >
        <UserSupabaseProvider>
          {/* <div className="flex justify-center items-center w-full h-screen bg-gray-200"> */}
          {/* <div className="flex flex-col items-center bg-white w-full h-full max-h-[900px] max-w-[400px] justify-between rounded-md"> */}
          <div className="flex justify-center items-center bg-gray-200">
            <Component {...pageProps} />
          </div>
          {/* </div> */}
          {/* </div> */}
        </UserSupabaseProvider>
      </ThirdwebProvider>
    </SessionProvider>
  );
}


export default MyApp;

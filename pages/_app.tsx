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


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThirdwebProvider
        activeChain="mumbai"
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
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
          <div
            style={{
              height: "100svh",
              background: "red",
            }}
            className="flex justify-center items-center w-full bg-gray-200"
          >
            <div
              style={{
                background: "blue",
              }}
              className="flex flex-col items-center bg-white w-full h-full max-h-[900px] max-w-[400px] justify-between rounded-md"
            >
              <Component {...pageProps} />
            </div>
          </div>
        </UserSupabaseProvider>
      </ThirdwebProvider>
    </SessionProvider>
  );
}


export default MyApp;

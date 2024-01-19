import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";


import { ACCOUNT_FACTORY_ADDRESS } from "../constants/addresses";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // This is the chain your dApp will work on.
  const activeChain = "mumbai";

  return (
    <SessionProvider session={session}>
        <ThirdwebProvider
          activeChain="mumbai"
          clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
          authConfig={{
            authUrl: "/api/thirdWebAuth",
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
          <div
            style={{
              height: "100svh",
              width: "100vw",
            }}
          >
            <Component {...pageProps} />
          </div>
        </ThirdwebProvider>
    </SessionProvider>
  );
}

export default MyApp;

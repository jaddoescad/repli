import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import {
  getAccessTokenAndSecret,
  initializeThirdwebAuth,
  onSignout,
  verifyTokenAndFetchUser,
} from "../utils/authUtils";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import { getSupabaseUser } from "../supabase/supabaseFunctions";

export default function Login() {
  const router = useRouter();

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

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
            onLogout: async () => {
              onSignout(supabase, router);
            },
            onLogin: async (token: string) => {
              //parse jwt token
               
              const payload = jwt.decode(token) as JwtPayload;
              const address = payload.sub;

              const user = await getSupabaseUser(supabase, address);

              if (user?.twitter_handle) {
                router.push("/profile");
              } else {
                router.push("/twitterauth");
              }
            },
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


export const getServerSideProps = async (ctx) => {
  const { accessToken, jwt_secret } = getAccessTokenAndSecret(ctx);
  const { getUser } = initializeThirdwebAuth();
  const user = await verifyTokenAndFetchUser(
    accessToken,
    jwt_secret,
    getUser,
    ctx
  );

  if (user?.twitter_handle) {
    return {
      props: {},
      redirect: { destination: "/profile", permanent: false },
    };
  } else if (user) {
    return {
      props: {},
      redirect: { destination: "/twitterauth", permanent: false },
    };
  }

  return { props: {} };
};

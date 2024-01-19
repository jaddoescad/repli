import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { getSupabaseUser } from "../supabase/supabaseFunctions";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const getAccessTokenAndSecret = (ctx) => {
  const accessToken = ctx.req.cookies[access_token_cookie];
  const jwt_secret = process.env.SUPABASE_JWT_SECRET;
  return { accessToken, jwt_secret };
};

export const initializeThirdwebAuth = () => {
  return ThirdwebAuth({
    domain:
      process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "http://localhost:3000",
    wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  });
};

export const verifyTokenAndFetchUser = async (
  accessToken,
  jwt_secret,
  getUser,
  ctx
) => {
  if (!accessToken || !jwt_secret) {
    return null;
  }

  try {
    jwt.verify(accessToken, jwt_secret);
    const thirdwebUser = await getUser(ctx.req);
    return thirdwebUser
      ? await getSupabaseUser(getSupabase(accessToken), thirdwebUser?.address)
      : null;
  } catch (err) {
    return null;
  }
};

// auth.js

export const withAuth = (getServerSidePropsFunc: any) => async (ctx: any) => {
  const { accessToken, jwt_secret } = getAccessTokenAndSecret(ctx);
  const { getUser } = initializeThirdwebAuth();
  const user = await verifyTokenAndFetchUser(
    accessToken,
    jwt_secret,
    getUser,
    ctx
  );

  if (!user) {
    return {
      props: {},
      redirect: { destination: "/", permanent: false },
    };
  }

  if (user && !user?.twitter_handle) {
    return {
      props: {},
      redirect: { destination: "/twitterauth", permanent: false },
    };
  }

  return await getServerSidePropsFunc(ctx, user);
};

export const onSignout = async (supabase, router) => {
  const { error } = await supabase.auth.signOut();
  if (error) return alert(error.message);
  router.push("/");
};

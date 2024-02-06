import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { access_token_cookie } from "../../../supabase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseServer } from "../../../supabase/createSupabaseServer";


export default async function customAuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //  30 minutes
  const tokenDurationInSeconds = 60 * 30; // Token valid for 30 minutes
  const refreshIntervalInSeconds = 60 * 5; // Refresh every 5 minutes

  const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
    
    authOptions: {
      tokenDurationInSeconds: tokenDurationInSeconds, // Token valid for 30 minutes
      refreshIntervalInSeconds: refreshIntervalInSeconds, // Refresh every 5 minutes
    },
    domain:
      process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "http://localhost:3000",
    wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
    callbacks: {
      onLogin: async (address, req) => {
        const payload = req.body.payload.payload;


        const supabaseServer = createSupabaseServer();


        const { data, error } = await supabaseServer
          .from("users")
          .select("*")
          .eq("address", address);

        if (error) {
          throw error;
        }

        let user = data ? data[0] : null;

        if (!user) {
          const { data: newUser, error: userError } = await supabaseServer
            .from("users")
            .insert([{ address }])
            .select("*");
          if (userError) {
            throw userError;
          }

          user = newUser[0];
        }
        const expirationTime = Math.floor(Date.now() / 1000) + tokenDurationInSeconds;

        const supabaseJWT = jwt.sign(
          
          {
            exp: expirationTime,
            aud: "authenticated",
            role: "authenticated",
            ...user,
            ...payload,
          },
          process.env.SUPABASE_JWT_SECRET!
        );
        

        return { token: supabaseJWT };
      },
      onUser(user, req) {
        try {
          res.setHeader(
            "Set-Cookie",
            cookie.serialize(access_token_cookie, user.session.token, {
              path: "/",
              secure: process.env.NODE_ENV !== "development",
              httpOnly: false,
              sameSite: "strict",
            })
          );
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    },
  });
  return await ThirdwebAuthHandler(req, res);
}

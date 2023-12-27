import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { createSupabaseServer } from "../../../supabase/createSupabaseServer";
import jwt from "jsonwebtoken";

const users: Record<string, any> = {};

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain:
    process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "http://localhost:3000",
  wallet: new PrivateKeyWallet(
    process.env.THIRDWEB_AUTH_PRIVATE_KEY ||
      "708c07661bd3bccce29545f340c4a6cd3dc435d29ebcf9798c2c3884d8c7e68f"
  ),
  callbacks: {
    onLogin: async (address) => {
      try {
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

      const payload = {
        ...user,
        aud: "authenticated",
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };

      console.log(payload);


      const token = jwt.sign(
        {
          ...payload,
        },
        process.env.SUPABASE_JWT_SECRET || ""
      );

      return { ...user, supabaseToken: token };
    } catch (error) {
      console.log(error);
      throw error;
    }
    },
  },
});

export default ThirdwebAuthHandler();
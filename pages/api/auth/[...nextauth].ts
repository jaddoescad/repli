import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { TwitterProfile } from "next-auth/providers/twitter";
import { NextApiRequest, NextApiResponse } from "next";
import { TwitterExtendedUser, ExtendedJWT } from "../../../types/types";
import { saveTwitterInfoInSupabase } from "../../../supabase/supabaseFunctions";
import { createSupabaseServer } from "../../../supabase/createSupabaseServer";
import fetch from "node-fetch";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function auth(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const supabaseServer = createSupabaseServer();

  return await NextAuth(request, response, {
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_CONSUMER_KEY || "",
        clientSecret: process.env.TWITTER_CONSUMER_SECRET || "",
        version: "2.0",

        userinfo: {
          url: "https://api.twitter.com/2/users/me",
          params: {
            "user.fields": "url,entities,profile_image_url",
          },
        },
        profile(profile: {
          data: TwitterProfile["data"] & {
            profile_image_url: string;
          };
        }) {
          return {
            id: profile.data.id,
            name: profile.data.name,
            username: profile.data.username,
            avatarUrl: profile.data.profile_image_url.replace(
              /_normal\.(jpg|png|gif)$/,
              ".$1"
            ),
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          const extendedUser = user as TwitterExtendedUser;

          const authParams = request.cookies.authParams;
          let address = "";

          // Check if authParams is defined and is a string
          if (typeof authParams === "string") {
            address = JSON.parse(authParams).address;
          }

          if (!address) {
            throw new Error("No user address");
          }

          const public_url = await uploadProfilePictureToSupabase(
            extendedUser.id.toString(),
            extendedUser.avatarUrl,
            supabaseServer
          );

          try {
            await saveTwitterInfoInSupabase(
              supabaseServer,
              address,
              extendedUser.id.toString(),
              extendedUser.username,
              extendedUser.name,
              public_url
            );
          } catch (error) {
            console.log("error", error);
            throw error;
          }

          token.user = {
            id: extendedUser.id.toString(),
            username: extendedUser.username,
            name: extendedUser.name,
            avatarUrl: public_url,
          };
        }
        return token as ExtendedJWT;
      },
      async session({ session, user, token }) {
        const extToken = token as ExtendedJWT;

        return {
          ...session,
          user: {
            // ...session.user,
            id: extToken.sub,
            username: extToken.user?.username,
            name: extToken.name,
            avatarUrl: extToken.user?.avatarUrl,
          },
        };
      },
    },
    pages: {
      signIn: "/twitterauth",
    },
  });
}

async function uploadProfilePictureToSupabase(userId: string, imageUrl: string, supabase: SupabaseClient<any, "public", any>) {
  try {
    // Step 1: Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch the image: ${response.statusText}`);
    const imageBuffer = await response.arrayBuffer();
    const fileName = `${userId}/profile.jpg`;

    // Step 2: Upload the image to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("profile_image")
      .upload(fileName, imageBuffer, {
        contentType: response.headers.get("content-type") as string,
        upsert: true,
      });


    if (uploadError) throw uploadError;

    const { data:publicUrlData } = supabase.storage
      .from("profile_image")
      .getPublicUrl(`${data.path}`);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading profile picture to Supabase:", error);
    throw error;
  }
}

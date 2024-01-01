import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { TwitterProfile } from "next-auth/providers/twitter";
import { NextApiRequest, NextApiResponse } from "next";
import { TwitterExtendedUser, ExtendedJWT } from "../../../types/types";
import initializeFirebaseServer from "../../../firebase/initFirebaseAdmin";
import { saveTwitterInfoInFirestoreServer } from "../../../firebase/firebaseServerFunctions";


export default async function auth(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return await NextAuth(request, response, {
    secret: process.env.NEXTAUTH_SECRET || "",
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_CONSUMER_KEY || "",
        clientSecret: process.env.TWITTER_CONSUMER_SECRET || "",
        version: "2.0",

        userinfo: {
          url: "https://api.twitter.com/2/users/me",
          params: {
            "user.fields": "url,entities,profile_image_url"
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
            )
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          const extendedUser = user as TwitterExtendedUser;
          const { auth, db } = initializeFirebaseServer();
      
          const authParams = request.cookies.authParams;
          let address = '';
      
          // Check if authParams is defined and is a string
          if (typeof authParams === 'string') {
            address = JSON.parse(authParams).address;
          }
      
          if (!address) {
            throw new Error("No user address");
          }

          saveTwitterInfoInFirestoreServer(
            db,
            address,
            extendedUser.id.toString(),
            extendedUser.username,
            extendedUser.name,
            extendedUser.avatarUrl
          );

          token.user = {
            id: extendedUser.id.toString(),
            username: extendedUser.username,
            name: extendedUser.name,
            avatarUrl: extendedUser.avatarUrl,
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
            avatarUrl: extToken.user?.avatarUrl
          },
        };
      },
    },
    pages: {
      signIn: "/twitterauth",
    },
  });
}





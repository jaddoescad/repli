import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { TwitterProfile } from "next-auth/providers/twitter";
import { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import { User } from "@thirdweb-dev/auth";
import {ExtendedUser, ExtendedJWT} from '../../../types/types'




export default async function auth(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return await NextAuth(request, response, {
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_CONSUMER_KEY || "",
        clientSecret: process.env.TWITTER_CONSUMER_SECRET || "",
        version: "2.0",
        userinfo: {
          url: "https://api.twitter.com/2/users/me",
          params: {
            "user.fields": "url,entities",
          },
        },
        profile(profile: { data: TwitterProfile["data"] }) {
          return {
            id: profile.data.id,
            name: profile.data.name,
            username: profile.data.username,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          const extendedUser = user as ExtendedUser;

          token.user = {
            id: extendedUser.id.toString(),
            username: extendedUser.username,
            name: extendedUser.name,
          };
        }
        return token as ExtendedJWT;
      },
      async session({ session, user, token }) {
        const extToken = token as ExtendedJWT;

        return {
          ...session,
          user: {
            ...session.user,
            id: extToken.id,
            username: extToken.username,
            name: extToken.name,
          },
        };
      },
    },
    pages: {
      signIn: "/verify-twitter",
    },
  });
}





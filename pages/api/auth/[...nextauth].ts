import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import axios from "axios";
import needle from "needle";
import { TwitterProfile } from "next-auth/providers/twitter";
import { createSupabaseServer } from "../../../supabase/createSupabaseServer";

export default async function auth(request, response) {
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
      async signIn({ user, account, profile, email, credentials }) {
        console.log("signin", user, account, profile, email, credentials);
        return true;
      },
      async jwt({ token, user }) {
        console.log("jwtuser", token);
        if (user) {
          token.user = user;
        }
        return token;
      },
      async session({ session, user, token }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.user.id,
            username: token.user.username,
            name: token.user.name,
          },
        };
      },
    },
    pages: {
      signIn: "/verify-twitter",
    },
  });
}





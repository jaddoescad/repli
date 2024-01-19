import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

export const access_token_cookie = "sb-access-token";

const getSupabase = (accessToken: string) => {
  const options: SupabaseClientOptions<"public"> = {};

  if (accessToken) {
    options.global = {
      headers: {
        // This gives Supabase information about the user (wallet) making the request
        Authorization: `Bearer ${accessToken}`,
      },

    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );

  supabase.realtime.setAuth(accessToken)

  return supabase;
};

export { getSupabase };
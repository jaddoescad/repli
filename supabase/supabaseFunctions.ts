import { SupabaseClient } from "@supabase/supabase-js";

export const checkTwitterHandle = async (
  address: string,
  supabase: SupabaseClient<any, "public", any>
) => {
  const { data, error } = await supabase
    .from("users")
    .select("twitterHandle")
    .eq("address", address);

  if (error) {
    throw error;
  }
  return data;
};

export const updateTwitterHandle = async (
  address: string,
  twitterHandle: string,
  twitterName: string,
  twitterId: string,
  supabase: SupabaseClient<any, "public", any>
) => {
  const { data, error } = await supabase
    .from("users")
    .update({ twitterHandle, twitterName, twitterId })
    .eq("address", address);

  if (error) {
    throw error;
  }
  
  return data;
};
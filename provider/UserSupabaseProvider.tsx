import React, { useEffect, useState, createContext } from 'react';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { UserWithData, useUser } from '@thirdweb-dev/react';

export const SupabaseContext = createContext<SupabaseClient<any, "public", any> | null>(null);


export const UserSupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<any, "public", any> | null>(null);
  const { user } = useUser() as { user: UserWithData<{ supabaseToken: string }, any> };

  useEffect(() => {
    if (user?.session?.supabaseToken) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
        {
          global: {
            headers: {
              Authorization: `Bearer ${user.session.supabaseToken}`,
            },
          },
        }
      );
      setSupabaseClient(client);
    }
  }, [user]);

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
};

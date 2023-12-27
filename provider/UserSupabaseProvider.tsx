import React, { useEffect, useState, createContext } from 'react';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { useUser } from '@thirdweb-dev/react';

export const SupabaseContext = createContext<SupabaseClient | null>(null);


export const UserSupabaseProvider = ({ children }) => {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const { user } = useUser();

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

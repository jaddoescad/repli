// import { createContext, useContext, useEffect, useState } from 'react';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { ConnectWallet, UserWithData, useUser } from '@thirdweb-dev/react';

// // Context for Supabase client
// const SupabaseContext = createContext(null);

// // Custom hook to initialize Supabase client
// export function useSupabaseClient(user: UserWithData | undefined) {
//   const [supabaseClient, setSupabaseClient] = useState(null);

//   useEffect(() => {
//     const session = user?.session ;
//     if (session?.supabaseToken) {
//       const client = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
//         {
//           global: {
//             headers: {
//               Authorization: `Bearer ${user.session.supabaseToken}`,
//             },
//           },
//         }
//       );
//       setSupabaseClient(client);
//     }
//   }, [user]);

//   return supabaseClient;
// }



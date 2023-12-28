import {
  getProviders,
  signIn,
  useSession,
  ClientSafeProvider,
} from "next-auth/react";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { SupabaseContext } from "../provider/UserSupabaseProvider";
import { updateTwitterHandle } from "../supabase/supabaseFunctions";
import { useUser } from "@thirdweb-dev/react";
import { ExtendedUser } from "../types/types";

export default function SignIn({
  providers: providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const supabaseClient = useContext(SupabaseContext);
  const { isLoading, user: thirdWebUser } = useUser();

  useEffect(() => {
    async function saveTwitterNameAndRedirect() {
      if (session && supabaseClient && thirdWebUser?.address) {
        const user = session.user as ExtendedUser;
        if (user && user.username) {
          await updateTwitterHandle(
            thirdWebUser?.address,
            user.username,
            user.name,
            user.id,
            supabaseClient
          );
        }
      }
    }
  
    saveTwitterNameAndRedirect();
  }, [session, router]);

  return (
    <div
    className="flex flex-col items-center bg-white w-full h-full justify-between rounded-md"
  >
      <div className="flex flex-col items-center justify-center w-full mt-14">
        <img src="/logo.png" alt="Logo" width="110" height="110" />
        <h1 className="text-sm font-medium text-gray-500">
          Attach value to every message
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-2 mb-6">
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="m-4">
            <button
              className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out
            ${
              provider.name === "Twitter"
                ? "bg-blue-400 hover:bg-blue-500"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
              onClick={async () => {
                const res = await signIn(
                  provider.id,
                  {
                    callbackUrl: "/welcome",
                  },
                  {
                    address: "address",
                  }
                );
              }}
            >
              Link your {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

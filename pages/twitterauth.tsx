import {
  getProviders,
  signIn,
  ClientSafeProvider,
} from "next-auth/react";
import { useUser } from "@thirdweb-dev/react";
import { getAccessTokenAndSecret, initializeThirdwebAuth, verifyTokenAndFetchUser } from "../utils/authUtils";

import nookies from "nookies";


export default function SignIn({
  providers: providers,
}: {
  providers: Record<string, ClientSafeProvider>;
}) {
  const { user: thirdWebUser } = useUser();


  return (
    <div className="flex flex-col items-center bg-white w-full h-full justify-between rounded-md">
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
                if (thirdWebUser?.address) {
                  //set cookie using nookies save address
                  nookies.set(
                    null,
                    "authParams",
                    JSON.stringify({
                      address: thirdWebUser?.address,
                    }),
                    {
                      path: "/",
                      maxAge: 30 * 24 * 60 * 60,
                      sameSite: "lax",
                    }
                  );

                  const res = await signIn(
                    provider.id,
                    {
                      callbackUrl: `${window.location.origin}/profile`,
                    },
                    {
                      address: thirdWebUser?.address,
                    }
                  );
                }
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

export async function getServerSideProps(ctx) {
  try {
    const providers = await getProviders();
    const { accessToken, jwt_secret } = getAccessTokenAndSecret(ctx);
    const { getUser } = initializeThirdwebAuth();

    if (!accessToken || !jwt_secret) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const user = await verifyTokenAndFetchUser(accessToken, jwt_secret, getUser, ctx);

    if (!user) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return user.twitter_handle
      ? { redirect: { destination: "/profile", permanent: false } }
      : { props: { providers } };
  } catch (err) {
    return { redirect: { destination: "/", permanent: false } };
  }
}

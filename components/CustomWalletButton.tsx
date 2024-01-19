import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import { onSignout } from "../utils/authUtils";

export const CustomWalletButton = ({
  data,
}: {
  data: { value: string; name: string };
}) => {
  const formattedValue = (parseInt(data?.value) / 1e18).toFixed(3);
  const router = useRouter();
  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);
  return (
    <ConnectWallet
      detailsBtn={() => (
        <button className="border-2 border-gray-700 rounded-full p-2">
          {`
            $${formattedValue} 
      
            `}
        </button>
        //   ${data?.name}
      )}
      style={{
        minWidth: "50px",
      }}
      auth={{
        onLogout: async () => {
            onSignout(supabase, router)
        //   const { error } = await supabase.auth.signOut();
        //   if (error) return alert(error.message);
        //   router.push("/");
        },
      }}
      theme={darkTheme({
        colors: {
          primaryButtonBg: "#A873E8",
          primaryButtonText: "#FFFFFF",
        },
      })}
      modalSize="compact"
      btnTitle={"Sign in"}
    />
  );
};

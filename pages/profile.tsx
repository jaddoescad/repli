import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useMemo, useState } from "react";
import { RiFileCopyLine } from "react-icons/ri";
import { onSignout, withAuth } from "../utils/authUtils";
import { getMe } from "../supabase/supabaseFunctions";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useLogout } from "@thirdweb-dev/react";


// Main component
const Home: NextPage = () => {
  return (
    <MainWrapper>
      <TopNavigation />

      <ChatList />

      <BottomNavigation />
    </MainWrapper>
  );
};


const ChatList = () => {
  const address = useAddress();
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>({});
  const router = useRouter();
  const {
    logout,
    isLoading
  } = useLogout();

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

  useEffect(() => {
    console.log("address", address);
  } , [address]);

  useEffect(() => {
    if (!address) return;
    const handleGetMe = async () => {
      const me = await getMe(address, supabase);
      console.log("me", me);
      setUser(me);
    };
    handleGetMe();
  }, [address]);

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  return (
    <div
      style={{ flexGrow: 1, overflowY: "auto" }}
      className="flex flex-col items-center w-full"
    >
      <div key={user?.address} className="flex items-center p-4 w-full">
        <img
          src={user?.avatar_url}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-4">
          <div className="font-bold text-xl">{user?.twitter_name}</div>
          <div className="text-gray-500 text-sm">{`@${user?.twitter_handle}`}</div>
          <div className="flex items-center">
            <div className="flex items-center">
              {user?.address ? (
                <div className="text-gray-500 text-sm">{`${user?.address.slice(
                  0,
                  4
                )}...${user?.address.slice(-4)}`}</div>
              ) : (
                <div className="text-gray-500 text-sm">
                  No address available
                </div>
              )}
            </div>
            <RiFileCopyLine
              className="ml-2 cursor-pointer"
              onClick={handleCopyAddress}
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            style={{
              borderTop: "1px solid #000",
              borderBottom: "1px solid #000",
              padding: "10px",
              width: "100vw",
            }}
          >
            <div className="flex items-center">
              <div className="text-gray-500 text-sm">Total Rewards Received</div>
              <div className="text-lg font-bold ml-6">1000 USDC</div>
            </div>
          </div>
          <div
            style={{
              borderBottom: "1px solid #000",
              padding: "10px",
              width: "100vw",
            }}
          >
            <div className="flex items-center">
              <div className="text-gray-500 text-sm">Total Rewards Sent</div>
              <div className="text-lg font-bold ml-14 balance">
                1000 USDC
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        style={{
          borderRadius: "9999px",
          padding: "10px 20px",
          backgroundColor: "#000",
          color: "#fff",
          marginTop: "20px",
        }}
        onClick={async () => {
          await logout();
          onSignout(supabase, router);
        }
        }
      >
        Sign Out
      </button>   
    </div>
  );
};


// This function will run at build time in production
export const getServerSideProps = withAuth(async (ctx) => {
  // You can use the user info here if needed, e.g., fetch data based on user
  // Example: const data = await fetchDataBasedOnUser(user);

  // Return the page props
  return { props: {} };
});

export default Home;
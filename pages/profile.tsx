import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import initializeFirebaseClient from "../firebase/initFirebase";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { getMe } from "../firebase/firebaseClientFunctions";
import { useEffect, useState } from "react";
import { RiFileCopyLine } from "react-icons/ri";

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

export default Home;

const ChatList = () => {
  const { db } = initializeFirebaseClient();
  const address = useAddress();
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (!address) return;
    const handleGetMe = async () => {
      const me = await getMe(db, address);
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
      <div key={user.address} className="flex items-center p-4 w-full">
        <img
          src={user.avatarUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-4">
          <div className="font-bold text-xl">{user.twitterName}</div>
          <div className="text-gray-500 text-sm">{`@${user.twitterHandle}`}</div>
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
              <div className="text-gray-500 text-sm">Total Rewards</div>
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
              <div className="text-gray-500 text-sm">Balance</div>
              <div className="text-lg font-bold ml-16 balance">
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
      >
        Sign Out
      </button>   
    </div>
  );
};

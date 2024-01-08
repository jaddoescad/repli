import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import initializeFirebaseClient from "../firebase/initFirebase";
import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import { getMe } from "../firebase/firebaseClientFunctions";
import { useEffect, useState } from "react";
import { ThirdwebSDK, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { ChatContractAddress } from "../contract-addresses";

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
  const contractAddress = ChatContractAddress;
  const { contract } = useContract(contractAddress);
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "deposit"
  );

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
      <button
        style={{
          borderRadius: "9999px",
          padding: "10px 20px",
          backgroundColor: "#000",
          color: "#fff",
          marginTop: "20px",
        }}
        onClick={async () => {
          const weiValue = ethers.utils.parseEther("0.00000000001");

          const myData = await mutateAsync({
            args: [1, "0x57f2AA8FEB4644D5684dA36c796A39A5f7C93Df4"],
            overrides: {
              gasLimit: 1000000,
              value: weiValue,
            },
          });

          console.log("myData", myData);
        }}
      >
        Call Contract
      </button>
    </div>
  );
};

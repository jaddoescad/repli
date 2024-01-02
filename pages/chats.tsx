import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import Link from "next/link";
import { getMyChatRooms } from "../firebase/firebaseClientFunctions";
import initializeFirebaseClient from "../firebase/initFirebase";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

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
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    if (!address) return;
    const handleGetMyChatRooms = async () => {
      const myChatRooms = await getMyChatRooms(db, address);
      setChats(myChatRooms);
    };
    handleGetMyChatRooms();
  }, [address]);

  useEffect(() => {
    console.log("chats", chats);
  }, [chats]);

  return (
    <div
      style={{ flexGrow: 1, overflowY: "auto" }}
      className="flex flex-col items-center justify-center w-full"
    >
      {chats.length === 0 ? (
        <div className="text-gray-500 flex items-center justify-center h-full">
          No Chats Available
        </div>
      ) : (
        chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.otherParticipant.address}`}
            className="flex items-center p-4 border-b w-full"
          >
            <img
              src={chat.otherParticipant.image}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover mr-4"
            />
            <div>
              <div className="flex items-center">
                <div className="font-bold">{chat.otherParticipant.name}</div>
                <div
                  style={{ fontSize: 12 }}
                  className="text-gray-600 ml-1 "
                >{`@${chat.otherParticipant.handle}`}</div>
              </div>

              <div className="text-gray-500">{chat.lastMessage}</div>
              <div
                style={{ fontSize: 12, marginTop: 10 }}
              className="text-gray-500">{chat.lastMessageTimestamp}</div>

            </div>
          </Link>
        ))
      )}
    </div>
  );
};

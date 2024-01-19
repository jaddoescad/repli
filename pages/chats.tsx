import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import Link from "next/link";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useMemo, useState } from "react";
import { withAuth } from "../utils/authUtils";
import { getMyChatRoomsSupabase } from "../supabase/supabaseFunctions";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import Cookies from "js-cookie";

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

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);


  const address = useAddress();
  const [chats, setChats] = useState<any[]>([]);
  

  useEffect(() => {
    if (!address) return;
    const handleGetMyChatRooms = async () => {
      const myChatRooms = await getMyChatRoomsSupabase(supabase, address);
      setChats(myChatRooms);
    };
    handleGetMyChatRooms();
  }, [address]);


  return (
    <div
      style={{ flexGrow: 1, overflowY: "auto" }}
      className="flex flex-col items-start w-full"
    >
      {chats.length == 0 ? (
        <div className="text-gray-500 flex items-center justify-center h-full align-middle w-full">
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
            <div className="w-full">
              <div className="flex items-center">
                <div className="font-bold">{chat.otherParticipant.name}</div>

              </div>

              <div className="text-gray-500">{chat.lastMessage}</div>
              <div
                style={{ fontSize: 12, marginTop: 10 }}
                className="text-gray-500 flex
                  justify-between
                "
              >
                {chat.lastMessageTimestamp}
                <div
                  style={{ fontSize: 12 }}
                  className="text-gray-600 ml-1 "
                >{`@${chat.otherParticipant.handle}`}</div>
              </div>
            </div>
          </Link>
        ))
      )}
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

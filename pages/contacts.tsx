interface User {
  address: string;
  avatar_url: string;
  twitter_name: string;
  twitter_handle: string;
}


import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { getUsersWithPagination } from "../supabase/supabaseFunctions";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import { withAuth } from "../utils/authUtils";

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
  //create state for users
  const [users, setUsers] = useState([]);

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);


  useEffect(() => {
    const getUsers = async () => {
      if (!address) return;
      const users = await getUsersWithPagination(supabase, address);
      setUsers(users);
    };

    getUsers();
  }
  , [address]);



  
  return (
    <div
      style={{ flexGrow: 1, overflowY: "auto" }}
      className="flex flex-col items-center w-full"
    >
      {users.map((user: User) => (
        <Link key={user?.address} href={`/chat/${user?.address}`} className="flex items-center p-4 border-b w-full">
            <img
              src={user?.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-4">
              <div className="font-bold">{user?.twitter_name}</div>
              <div className="text-gray-500">{`@${user?.twitter_handle}`}</div>
            </div>
        </Link>
      ))}
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
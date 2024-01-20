

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
import { useCallback } from "react";
import { debounce } from "lodash"; // Import debounce from lodash

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
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

  // useEffect(() => {
  //   const getUsers = async () => {
  //     if (!address) return;
  //     const users = await getUsersWithPagination(supabase, address);
  //     setUsers(users);
  //   };

  //   getUsers();
  // }, [address]);
  // Debounce search term to prevent too many requests
  const debouncedSearchTerm = useCallback(
    debounce(async (searchTerm) => {
      await getUsers(searchTerm);
    }, 500),
    [] // Dependencies array
  );

  useEffect(() => {
    if (!address) return;
    debouncedSearchTerm(searchTerm);
  }, [address, searchTerm, debouncedSearchTerm]);

  const getUsers = async (searchTerm) => {
    const users = await getUsersWithPagination(supabase, address, searchTerm); // Modify to pass searchTerm
    setUsers(users);
  };

  return (
    <div
      style={{ flexGrow: 1, overflowY: "auto" }}
      className="flex flex-col items-center w-full"
    >
      <div className="w-full flex items-center justify-center border-gray-300 mx-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 focus:outline-none mx-8 my-4 rounded-full"
        />
      </div>
      {users.map((user: User) => (
        <Link
          key={user?.address}
          href={`/chat/${user?.address}`}
          className="flex items-center p-4 border-b w-full"
        >
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
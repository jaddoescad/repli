const mockChats = [
  {
    id: 1,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "John Doe",
    rewards: "100",
  },
  {
    id: 2,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Jane Smith",
    rewards: "200",
  },
  {
    id: 3,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Mike Johnson",
    rewards: "300",
  },
  {
    id: 4,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "John Doe",
    rewards: "100",
  },
  {
    id: 5,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Jane Smith",
    rewards: "200",
  },
  {
    id: 6,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Mike Johnson",
    rewards: "300",
  },
  {
    id: 7,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "John Doe",
    rewards: "100"
  },
  {
    id: 8,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Jane Smith",
    rewards: "200"
  },
  {
    id: 9,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Mike Johnson",
    rewards: "300"
  },
  // Add more chat objects as needed
];

interface User {
  address: string;
  avatarUrl: string;
  twitterName: string;
  twitterHandle: string;
}


import { NextPage } from "next";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";
import MainWrapper from "../wrappers/MainWrapper";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { getUsersWithPagination } from "../firebase/firebaseClientFunctions";
import initializeFirebaseClient from "../firebase/initFirebase";
import { DocumentData } from "firebase-admin/firestore";

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
  const address = useAddress();
  const { db } = initializeFirebaseClient();
  //create state for users
  const [users, setUsers] = useState<DocumentData>([]);

  useEffect(() => {
    const getUsers = async () => {
      if (!address) return;
      const users = await getUsersWithPagination(db, address);
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
        <Link key={user.address} href={`/chat/${user.address}`} className="flex items-center p-4 border-b w-full">
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-4">
              <div className="font-bold">{user.twitterName}</div>
              <div className="text-gray-500">{`@${user.twitterHandle}`}</div>
            </div>
        </Link>
      ))}
    </div>
  );
};


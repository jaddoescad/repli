const mockChats = [
  {
    id: 1,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
  },
  {
    id: 2,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Jane Smith",
    lastMessage: "Are you free tomorrow?",
  },
  {
    id: 3,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Mike Johnson",
    lastMessage: "Let's meet for lunch!",
  },
  {
    id: 1,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
  },
  {
    id: 2,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Jane Smith",
    lastMessage: "Are you free tomorrow?",
  },
  {
    id: 3,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Mike Johnson",
    lastMessage: "Let's meet for lunch!",
  },
  {
    id: 1,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
  },
  {
    id: 2,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Jane Smith",
    lastMessage: "Are you free tomorrow?",
  },
  {
    id: 3,
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWHVCc66piEwKK1j9MC6PfVddig72N4Q8sHguGnHLrA&s",
    name: "Mike Johnson",
    lastMessage: "Let's meet for lunch!",
  },
  // Add more chat objects as needed
];

import {
  ConnectWallet,
  darkTheme,
  useUser,
  useBalance,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FaAddressBook, FaComments, FaUser } from "react-icons/fa";
import chatDollarIcon from "../bottom-navigation-icons/chatdollar.png";
import { useEffect } from "react";
import BottomNavigation from "../components/BottomNavigation";

// Main component
const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        // display: "flex",
        // flexDirection: "column",
      }}
      // className="flex flex-col"
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopNavigation />

        <ChatList />

        <BottomNavigation />
      </div>
    </div>
  );
};

export default Home;

const TopNavigation = ({}) => {
  const { isLoading, user } = useUser();
  const { data } = useBalance();

  return (
    <div
      style={{ height: "60px" }}
      className="w-full bg-white py-4 px-6 text-black flex justify-between"
    >
      <div>
        <img
          src="logoside.png"
          alt="Logo"
          className="logo"
          style={{ height: "40px" }}
        />
      </div>
      <ConnectWallet
        detailsBtn={() => (
          <button className="border-2 border-gray-700 rounded-full p-2">
            {`
    ${data?.value} ${data?.name}
    `}
          </button>
        )}
        style={{
          minWidth: "50px",
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
    </div>
  );
};

const ChatList = () => {
  return (
    <div // Set height to 100% and make it scrollable
      style={{ flexGrow: 1, overflowY: "auto" }}
      className="flex flex-col items-center w-full"
    >
      {mockChats.map((chat) => (
        <div key={chat.id} className="flex items-center p-4 border-b w-full">
          <img
            src={chat.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="font-bold">{chat.name}</div>
            <div className="text-gray-500">{chat.lastMessage}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

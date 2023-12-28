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

// Main component
const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <div
      style={{
        background: "green",
        height: "100%",
        width: "100%",
      }}
      // className="flex flex-col"
    >
      <TopNavigation />

      {/* <ChatList /> */}

      <BottomNavigation />
    </div>
  );
};

export default Home;

const TopNavigation = ({}) => {
  const { isLoading, user } = useUser();
  const { data } = useBalance();

  return (
    <div
      style={{ height: "60px", background: "teal" }}
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
          // borderRadius: "50px",
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

const BottomNavigation = () => {
  const navigationItems = [
    {
      icon: (
        <img
          src={"/bottom-navigation-icons/searchuser.png"}
          alt="Contacts"
          style={{ width: "26px", height: "26px" }} // Adjust icon size here
        />
      ),
      label: "Contacts",
    },
    {
      icon: (
        <img
          src={"/bottom-navigation-icons/chatdollar.png"}
          alt="Chat Dollar"
          style={{ width: "26px", height: "26px" }} // Adjust icon size here
        />
      ),
      label: "Chat",
    },
    {
      icon: (
        <img
          src={"/bottom-navigation-icons/profile.png"}
          style={{ width: "26px", height: "26px" }} // Adjust icon size here
        />
      ),
      label: "Profile",
    },
  ];

  return (
    <div
      style={{ height: "60px", background: "maroon" }}
      className="w-full bg-white py-2 px-6 text-black flex justify-between items-center border-t-2 border-gray-300"
    >
      {navigationItems.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center"
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: "12px" }}>{item.label}</span>
        </button>
      ))}
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

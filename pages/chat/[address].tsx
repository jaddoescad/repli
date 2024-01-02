import { NextPage } from "next";
import MainWrapper from "../../wrappers/MainWrapper";
import Link from "next/link";
import initializeFirebaseClient from "../../firebase/initFirebase";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  getChatRoomId,
  getChatUser,
  onChatMessages,
  sendMessage,
} from "../../firebase/firebaseClientFunctions";
import { IoChevronBackSharp } from "react-icons/io5";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { DocumentData } from "firebase-admin/firestore";

interface ChatUser {
  twitterName: string;
  twitterHandle: string;
  avatarUrl: string;
}

// Main component
const Home: NextPage = () => {
  //get  param from router
  const router = useRouter();
  const { address } = router.query;
  const { db } = initializeFirebaseClient();
  const myAddress = useAddress();

  const [chat, setChat] = useState<any[]>([]);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  
  useEffect(() => {
    if (!address || typeof address !== "string" || !myAddress) return;

    const chatRoomId = getChatRoomId(myAddress, address);
    const unsubscribe = onChatMessages(db, chatRoomId, setChat);

    const handleGetMyChatRooms = async () => {
      const chatUser_ = await getChatUser(db, address);
      if (chatUser_) {
        setChatUser(chatUser_ as ChatUser);
      }
    };

    handleGetMyChatRooms();
    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, [address, myAddress, db]);

  useEffect(() => {
    console.log("chat", chat);
  }, [chat]);

  if (!myAddress || typeof myAddress !== "string") {
    // Return null or some placeholder/loading component
    return null; // or <LoadingComponent />
  }

  return (
    <MainWrapper>
      {chatUser && <TopNavigation chatUser={chatUser} />}

      <ChatList chat={chat} myAddress={myAddress} />

      <BottomNavigation />
    </MainWrapper>
  );
};

export default Home;

const ChatList = ({ chat, myAddress }: { chat: any[], myAddress: string }) => {
  const groupMessagesByDate = (messages: any[]) => {
    return messages.reduce((groups: { [key: string]: any[] }, message: any) => {
      const date = new Date(message.createdAt.seconds * 1000).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(chat);

  return (
    <div className="w-full h-full overflow-y-auto">
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          {/* <div className="date-header">{date}</div> */}
          {groupedMessages[date].map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={message.sender === myAddress}
            />
          ))}
        </div>
      ))}
      <style jsx>{`
        .date-header {
          text-align: center;
          margin: 10px 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

const TopNavigation = ({
  chatUser,
}: {
  chatUser: { twitterName: string; twitterHandle: string; avatarUrl: string };
}) => {
  const router = useRouter();
  const handleBackButtonClick = () => {
    router.back(); // Go back to the previous page
  };

  useEffect(() => {
    console.log("chatUser", chatUser);
  }, [chatUser]);

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onTouchMove={handleTouchMove}
      style={{
        borderBottom: "1px solid #000000",
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
      }}
      className="w-full bg-white py-4 px-6 text-black"
    >
      <IoChevronBackSharp
        style={{
          marginRight: "10px",
          fontSize: "20px",
        }}
        onClick={() => {
          // Handle back button click event
          handleBackButtonClick();
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={chatUser.avatarUrl}
          alt="Avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div>
          <div style={{ fontWeight: "bold" }}>{chatUser.twitterName}</div>
          <div style={{ fontSize: "12px" }}>{`@${chatUser.twitterHandle}`}</div>
        </div>
      </div>
      <div>
        <button style={{ marginRight: "10px" }}>
          <button>
            <PiDotsThreeOutlineFill />
          </button>
        </button>
      </div>
    </div>
  );
};

const BottomNavigation = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Add type annotation for the ref object
  const { db } = initializeFirebaseClient();
  const myAddress = useAddress();
  const { address } = router.query;

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "25px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Function to handle send button click
  const handleSend = () => {
    // Implement your send action here
    if (!address || typeof address !== "string" || !myAddress) return;
    sendMessage(db, myAddress, address, text);
    setText(""); // Clear the text area after sending
  };

  return (
    <div className="py-2 border-t-2 border-gray-300 px-4">
      <div className="w-full bg-white  text-black flex items-end">
        <textarea
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here"
          className="flex-grow"
          style={{ minHeight: "25px", resize: "none", padding: "15px" }}
        />
        <button
          onClick={handleSend}
          className="ml-4 text-blue-500 hover:text-blue-700 flex justify-center items-center font-bold"
        >
          send
        </button>
      </div>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md mt-2 self-start"
        style={{ fontSize: "15px" }}
      >
        {" "}
        1 USD
      </button>
    </div>
  );
};

const MessageBubble = ({ message, isMine }: { message: any, isMine: any }) => {
  return (
    <div className={`bubble ${isMine ? "mine" : ""}`}>
      <p>{message.message}</p>
      <span style={{ fontSize: "10px", opacity: "0.7" }}>
        {new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </span>
      <style jsx>{`
        .bubble {
          background-color: #f0f0f0;
          margin: 10px;
          padding: 10px;
          border-radius: 10px;
          justify-content: space-between;
          display: block;
          width: fit-content;
        }
        .mine {
          background-color: #a0c4ff;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

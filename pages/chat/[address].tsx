import { NextPage } from "next";
import MainWrapper from "../../wrappers/MainWrapper";
import { useAddress, useBalance, useContract, useContractWrite } from "@thirdweb-dev/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  getChatUserSupabase,
  onChatMessagesSupabase,
  sendMessage,
} from "../../supabase/supabaseFunctions";

import { IoChevronBackSharp } from "react-icons/io5";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { ChatContractAddress } from "../../constants/contract-addresses";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../../supabase/auth";
import { withAuth } from "../../utils/authUtils";
import { CustomWalletButton } from "../../components/CustomWalletButton";
import { getChatRoomId } from "../../utils/utils";
import { ChatUser } from "../../types/types";
import { fetchInitialMessages } from "../../supabase/supabaseFunctions";


// Main component
const Home: NextPage = () => {
  //get  param from router
  const router = useRouter();
  const { address } = router.query;
  const myAddress = useAddress();

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

  const [chat, setChat] = useState([]);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);


  useEffect(() => {
    if (!address || typeof address !== "string" || !myAddress) return;

    const chatRoomId = getChatRoomId(myAddress, address);
    fetchInitialMessages(supabase, chatRoomId, setChat);
    const unsubscribe = onChatMessagesSupabase(supabase, chatRoomId, setChat);

    const handleGetMyChatRooms = async () => {
      const chatUser_ = await getChatUserSupabase(supabase, address);
      if (chatUser_) {
        setChatUser(chatUser_ as ChatUser);
      }
    };

    handleGetMyChatRooms();

    return () => {
      supabase.removeChannel(unsubscribe);
    };
  }, [address, myAddress]);





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



const ChatList = ({ chat, myAddress }: { chat: any[]; myAddress: string }) => {
  const groupMessagesByDate = (messages: any[]) => {
    return messages.reduce((groups: { [key: string]: any[] }, message: any) => {
      const date = new Date(message.created_at).toDateString();
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
          <div className="date-header">{date}</div>
          {groupedMessages[date].map((userMessage) => (
            <>
              <MessageBubble
                key={userMessage.id}
                message={userMessage.message}
                created_at={userMessage.created_at}
                isMine={userMessage.sender === myAddress}
              />

              <TransactionMessage
                key={userMessage.id + "_contract"}
                hash={userMessage.transaction_hash}
                weiValue={userMessage.wei_value}
                created_at={userMessage.created_at}
                isMine={userMessage.sender === myAddress}
              />
            </>
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
  chatUser: { twitter_name: string; twitter_handle: string; avatar_url: string };
}) => {
  const router = useRouter();
  const { data } = useBalance();

  const handleBackButtonClick = () => {
    router.back(); // Go back to the previous page
  };

  const handleTouchMove = (e: any) => {
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
          src={chatUser?.avatar_url}
          alt="Avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div>
          <div style={{ fontWeight: "bold" }}>{chatUser?.twitter_name}</div>
          <div style={{ fontSize: "12px" }}>{`@${chatUser?.twitter_handle}`}</div>
        </div>
      </div>
      <div>
      <CustomWalletButton data={data}/>

      </div>
    </div>
  );
};

const BottomNavigation = () => {
  const { refetch } = useBalance();

  const router = useRouter();
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Add type annotation for the ref object
  const myAddress = useAddress();
  const { address } = router.query;
  const contractAddress = ChatContractAddress;
  const { contract } = useContract(contractAddress);
  const {
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    status,
    data,
    failureReason,
    variables,
  } = useContractWrite(contract, "deposit");
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "25px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

  // Function to handle send button click
  const handleSend = async () => {
    if (!address || typeof address !== "string" || !myAddress) return;

    try {
      await sendMessage(
        supabase,
        myAddress,
        address,
        text,
        0.000001,
        mutateAsync,
        refetch
      );
      setText(""); // Clear the text area after sending
    } catch (e) {
      console.log("error", e);
    }
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
          onClick={() => {
            try {
              handleSend();
            } catch (e) {
              console.log("this error", e);
            }
          }}
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

const MessageBubble = ({
  message,
  isMine,
  created_at,
}: {
  message: any;
  isMine: any;
  created_at: any;
}) => {
  return (
    <div className={`bubble ${isMine ? "mine" : ""}`}>
      <div>{created_at}</div>

      <p>{message}</p>
      <span style={{ fontSize: "10px", opacity: "0.7" }}>
        {new Date(created_at).toLocaleTimeString([], {
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

const TransactionMessage = ({
  hash,
  weiValue,
  isMine,
  created_at,
}: {
  hash: any;
  weiValue: any;
  isMine: any;
  created_at: any;
}) => {
  return (
    <div className={`bubble ${isMine ? "mine" : ""}`}>
      <p>
        {hash ? `hash: ${hash}, value: ${weiValue}` : "Pending Transaction..."}
      </p>
      <span style={{ fontSize: "10px", opacity: "0.7" }}>
        {new Date(created_at.seconds * 1000).toLocaleTimeString([], {
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

// This function will run at build time in production
export const getServerSideProps = withAuth(async (ctx) => {
  // You can use the user info here if needed, e.g., fetch data based on user
  // Example: const data = await fetchDataBasedOnUser(user);

  // Return the page props
  return { props: {} };
});

export default Home;
import { NextPage } from "next";
import MainWrapper from "../../wrappers/MainWrapper";
import {
  useAddress,
  useBalance,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  getChatUserSupabase,

  sendMessage,
} from "../../supabase/supabaseFunctions";
import { debounce } from 'lodash';

import { ChatContractAddress } from "../../constants/contract-addresses";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../../supabase/auth";
import { withAuth } from "../../utils/authUtils";
import { getChatRoomId } from "../../utils/utils";
import { ChatUser } from "../../types/types";
import { fetchInitialMessages } from "../../supabase/supabaseFunctions";
import { TransactionMessage } from "../../components/TransactionMessage";
import { MessageBubble } from "../../components/RegularMessage";
import Loader from "../../components/Loader";
import { TopChatNavigation } from "../../components/TopChatNavigation";

// Main component
const Home: NextPage = () => {
  //get  param from router
  const router = useRouter();
  const { address } = router.query;
  const myAddress = useAddress();
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const chatContainerRef = useRef(null); // Ref for the chat container

  const [page, setPage] = useState(1); // Add a page state
  const [hasMore, setHasMore] = useState(true); //

  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

  const [chat, setChat] = useState([]);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const chatRoomId = getChatRoomId(myAddress, address);

  const fetchData = async (page: number, limit: number = 5) => {
    setIsLoading(true); // Start loading
    const moreMessages = await fetchInitialMessages(
      supabase,
      chatRoomId,
      page,
      limit
    );


    if (moreMessages.length < limit) {
      setHasMore(false); // No more messages to load
    }


    if (page === 1) {
      setChat(moreMessages);
    } else {
      setChat((prevMessages) => [...moreMessages, ...prevMessages]); // Append new messages at the beginning
    }
    setIsLoading(false); // End loading after messages are fetched
  };

  const loadMoreMessages = async (prevScrollHeight) => {
    if (!chatContainerRef.current) return;

    setPage((prevPage) => prevPage + 1);
    await fetchData(page + 1);

    // Use a timeout to ensure that the DOM has updated
    setTimeout(() => {
      if (!chatContainerRef.current) return;

      const currentScrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTop =
        currentScrollHeight - prevScrollHeight;
    }, 0); // Timeout with 0 delay allows the DOM to update
  };

  useEffect(() => {
    if (!address || typeof address !== "string" || !myAddress) return;

    // const unsubscribe = onChatMessagesSupabase(supabase, chatRoomId, setChat);

    const handleGetMyChatRooms = async () => {
      const chatUser_ = await getChatUserSupabase(supabase, address);
      if (chatUser_) {
        setChatUser(chatUser_ as ChatUser);
      }
    };

    handleGetMyChatRooms();

    // return () => {
    //   supabase.removeChannel(unsubscribe);
    // };
  }, [address, myAddress]);

  useEffect(() => {
    // Only fetch data if address and myAddress are valid
    if (address && typeof address === "string" && myAddress) {
      fetchData(1); // Fetch the first page
    }
  }, [address, myAddress]); // Depend on address and myAddress

  if (!myAddress || typeof myAddress !== "string") {
    // Return null or some placeholder/loading component
    return null; // or <LoadingComponent />
  }

  return (
    <MainWrapper>
      {chatUser && <TopChatNavigation chatUser={chatUser} />}

      {/* Pass isLoading as a prop */}
      <ChatList
        chat={chat}
        myAddress={myAddress}
        isLoading={isLoading}
        chatContainerRef={chatContainerRef}
        loadMoreMessages={loadMoreMessages}
        hasMore={hasMore}
        dataFullyLoaded={!isLoading}
      />

      <BottomNavigation setChat={setChat} />
    </MainWrapper>
  );
};

const ChatList = ({
  chat,
  myAddress,
  isLoading,
  loadMoreMessages, // Function to load more messages
  hasMore, // Indicates if more messages are available
  chatContainerRef,
  dataFullyLoaded,
}: {
  chat: any[];
  myAddress: string;
  isLoading: boolean;
  loadMoreMessages: (prevScrollHeight: number) => void;
  hasMore: boolean;
  chatContainerRef: any;
  dataFullyLoaded: boolean;
}) => {
  const bottomListRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // New state variable for initial load
  const observer = useRef(null); // Ref for the observer

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

  const handleScroll = () => {
    if (!chatContainerRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollTop === 0 && hasMore) {
      const prevScrollHeight = scrollHeight;
      loadMoreMessages(prevScrollHeight);
    }
  };

  const groupedMessages = groupMessagesByDate(chat);

  useEffect(() => {
    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore, chat.length]); // Add dependencies

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };
  const debouncedScrollToBottom = debounce(scrollToBottom, 100);


  useLayoutEffect(() => {
    if (dataFullyLoaded) {
      debouncedScrollToBottom();
    }
  }, [dataFullyLoaded]);


  

  return (
    <div ref={chatContainerRef} className="w-full h-full overflow-y-auto pb-10">
      {isLoading && ( // Show loader when loading
        <div
          className="
          flex
          justify-center
          items-center
          w-full
          my-4
        "
        >
          <Loader />
        </div>
      )}
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          <div
            className="
            text-center
            text-sm
            mt-4
            text-gray-500
          "
          >
            {date}
          </div>
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
                messageStatus={
                  userMessage.sender === myAddress
                    ? "Awaiting response"
                    : "Respond and earn"
                }
              />
            </>
          ))}
        </div>
      ))}
      <style jsx>{`
        .date-header {
          color: #666;
        }
      `}</style>
      <div ref={bottomListRef} />
    </div>
  );
};

const BottomNavigation = ({ setChat }) => {
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
        refetch,
        setChat
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
        1 USD
      </button>
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

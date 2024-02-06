import Chat, {
  Bubble,
  useMessages,
  useForwardRef,
  useClickOutside,
  useMount,
  useComponents,
  Input,
} from "@chatui/core";

import "@chatui/core/dist/index.css";
import {
  fetchInitialMessages,
  getChatUserSupabase,
  onChatMessagesSupabase,
  sendMessage,
} from "../supabase/supabaseFunctions";
import { getChatRoomId } from "../utils/utils";
import React, { use, useEffect, useMemo, useState, useRef } from "react";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import { useBalance, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ChatContractAddress } from "../constants/contract-addresses";
import Loader from "./Loader";
import { formatTransactionMessage } from "./TransactionMessage";
import { TopChatNavigation } from "../components/TopChatNavigation";
import { ChatUser } from "../types/types";

const ChatApp = ({
  myAddress,
  recipientAddress,
}: {
  myAddress: string;
  recipientAddress: string;
}) => {
  const {
    messages,
    appendMsg,
    setTyping,
    deleteMsg,
    prependMsgs,
    updateMsg,
    resetList,
  } = useMessages([]);

  const chatRoomId = getChatRoomId(myAddress, recipientAddress);
  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);
  const [page, setPage] = useState(1); // Add a page state
  const [hasMore, setHasMore] = useState(true); //
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const MESSAGES_LIMIT = 5; // Define the limit as a constant
  const contractAddress = ChatContractAddress;
  const { contract } = useContract(contractAddress);
  const {
    mutateAsync,
    isLoading: isLoadingContract,
    error,
    isSuccess,
    status,
    data,
    failureReason,
    variables,
  } = useContractWrite(contract, "deposit");
  const { refetch } = useBalance();
  const messagesRef = useRef(messages); // Initialize with the current messages
  const composerRef = useRef(); // Create a ref for the composer
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);

  useEffect(() => {
    messagesRef.current = messages; // Update the ref to point to the new messages
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onChatMessagesSupabase(
      supabase,
      chatRoomId,
      appendMsg,
      updateMsg,
      messagesRef,
      myAddress,
      formatTransactionMessage
    );

    return () => {
      supabase.removeChannel(unsubscribe);
    };
  }, [myAddress, recipientAddress]);

  // Define the function to fetch and prepend messages
  const initializeChat = async () => {
    setIsLoading(true);
    let initialMessages = await fetchInitialMessages(
      supabase,
      chatRoomId,
      page,
      MESSAGES_LIMIT
    );

    initialMessages = initialMessages.reverse();

    const formattedMessages = initialMessages.flatMap((message) => {
      const formattedMessage = {
        _id: message.id,
        type: "text",
        content: { text: message.message },
        position: message.sender === myAddress ? "right" : "left",
      };

      // Prepare an array to collect the formatted messages
      const messageParts = [formattedMessage];

      // If the message has a transaction, format and add the transaction message
      const transactionMessage = formatTransactionMessage(message, myAddress);
      if (transactionMessage) messageParts.push(transactionMessage);

      return messageParts;
    });

    prependMsgs(formattedMessages); // Prepend messages for subsequent pages

    setHasMore(initialMessages.length === MESSAGES_LIMIT);
    setIsLoading(false);
  };

  useEffect(() => {
    // Call the function to initialize or update chat when 'page' changes
    if (myAddress && recipientAddress) {
      initializeChat();
    }
  }, []);

  useEffect(() => {
    console.log(composerRef.current);
  }, [composerRef]);

  const handleSend = async (type, val) => {
    if (type === "text" && val.trim()) {
      try {
        // Invoke the imported sendMessage function
        await sendMessage(
          supabase,
          myAddress,
          recipientAddress,
          val,
          0.000001,
          mutateAsync,
          refetch,
          appendMsg,
          updateMsg

          // other necessary arguments (e.g., mutateAsync, refetch) should be passed or managed inside this component
        );
        // If successful, you might want to update or remove the tempMessage in your messages state
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle the error, e.g., show an error message, revert the temp message, etc.
      }
    }
  };


  useEffect(() => {
    if (!recipientAddress || typeof recipientAddress !== "string" || !myAddress) return;

    // const unsubscribe = onChatMessagesSupabase(supabase, chatRoomId, setChat);

    const handleGetMyChatRooms = async () => {
      const chatUser_ = await getChatUserSupabase(supabase, recipientAddress);
      if (chatUser_) {
        setChatUser(chatUser_ as ChatUser);
      }
    };

    handleGetMyChatRooms();

    // return () => {
    //   supabase.removeChannel(unsubscribe);
    // };
  }, [recipientAddress, myAddress]);

  function renderMessageContent(msg) {
    const { content, type, status } = msg;

    switch (type) {
      case "text":
        return (
          <Bubble>
            <p>{content.text}</p>
            {status === "loading" && (
              <div className="w-full  flex justify-end">
                <Loader size={2} />
              </div>
            )}
          </Bubble>
        );

      case "custom":
        return content.component;
      default:
        return null;
    }
  }

  const loadMoreMessages = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true); // Set loading state to true while fetching
    const newMessages = await fetchInitialMessages(
      supabase,
      chatRoomId,
      page + 1,
      MESSAGES_LIMIT
    );

    // Format the new messages similar to initializeChat
    const formattedMessages = newMessages.reverse().flatMap((message) => {
      const formattedMessage = {
        _id: message.id,
        type: "text",
        content: { text: message.message },
        position: message.sender === myAddress ? "right" : "left",
      };
      const messageParts = [formattedMessage];
      const transactionMessage = formatTransactionMessage(message, myAddress);
      if (transactionMessage) messageParts.push(transactionMessage);
      return messageParts;
    });

    prependMsgs(formattedMessages); // Prepend the newly fetched and formatted messages
    setPage((prevPage) => prevPage + 1); // Increment the page
    setIsLoading(false); // Set loading state to false after fetching

    // If the number of fetched messages is less than the limit, no more messages are available
    setHasMore(newMessages.length === MESSAGES_LIMIT);
  };

  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight } = event.target;

    if (scrollTop === 0 && hasMore) {
      const currentScrollHeight = scrollHeight;
      await loadMoreMessages();

      requestAnimationFrame(() => {
        const newScrollHeight = event.target.scrollHeight;
        const scrollOffset = newScrollHeight - currentScrollHeight;
        event.target.scrollTop = scrollTop + scrollOffset;
      });
    }
  };

  return (
    <>
      {chatUser && (
        <Chat
          navbar={{ title: "Assistant" }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
          locale="en-US"
          placeholder="Type a message..."
          loadMoreText="Load earlier messages"
          onScroll={handleScroll}
          onAccessoryToggle={() => console.log("Accessory Toggled")}
          onBackBottomClick={() => console.log("Back Bottom Clicked")}
          onBackBottomShow={() => console.log("Back Bottom Shown")}
          quickRepliesVisible={true}
          wideBreakpoint="40em"
          Composer={Composer}
          renderNavbar={() => <TopChatNavigation chatUser={chatUser} />}
          rightAction={
            <button
              onClick={() => console.log("Right Action Clicked")}
              style={{ color: "white", backgroundColor: "purple" }}
            >
              Right
            </button>
          }
          renderBeforeMessageList={() =>
            isLoading && (
              <div className="flex justify-center items-center">
                <p
                  className="text-xl font-bold text-center"
                  style={{ color: "#F2B25D" }}
                >
                  Loading...
                </p>
              </div>
            )
          }
        />
      )}
    </>
  );
};

export default ChatApp;

const Composer = React.memo(({ onSend, placeholder }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (message: string) => {
    setMessage(message);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend("text", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex m-3">
      <Input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <button
        onClick={handleSend}
        style={{
          background: "purple",
          marginLeft: "10px",
          borderRadius: "20px",
          color: "white",
          border: "none",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        Send
      </button>{" "}
    </div>
  );
});

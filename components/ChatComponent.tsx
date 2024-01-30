import Chat, {
  Bubble,
  Card,
  CardMedia,
  CardText,
  CardTitle,
  InfiniteScroll,
  useMessages,
} from "@chatui/core";
import "@chatui/core/dist/index.css";
import {
  fetchInitialMessages,
  getChatUserSupabase,
  onChatMessagesSupabase,
  sendMessage,
} from "../supabase/supabaseFunctions";
import { getChatRoomId } from "../utils/utils";
import { use, useEffect, useMemo, useState, useRef } from "react";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../supabase/auth";
import { useBalance, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ChatContractAddress } from "../constants/contract-addresses";
import Loader from "./Loader";
import { formatTransactionMessage } from "./TransactionMessage";


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

  useEffect(() => {
    messagesRef.current = messages; // Update the ref to point to the new messages
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onChatMessagesSupabase(supabase, chatRoomId, appendMsg, updateMsg, messagesRef, myAddress);

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
        _id : message.id,
        type: "text",
        content: { text: message.message },
        position: message.sender === myAddress ? "right" : "left",
      };

      // Prepare an array to collect the formatted messages
      const messageParts = [formattedMessage];

      // If the message has a transaction, format and add the transaction message
      const transactionMessage = formatTransactionMessage(message, myAddress);
      messageParts.push(transactionMessage);

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
  }, [myAddress, recipientAddress, supabase, chatRoomId, appendMsg, page]);

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

    setPage((prevPage) => prevPage + 1); // Increment the page
    setIsLoading(false); // Set loading state to false after fetching

    // If the number of fetched messages is less than the limit, no more messages are available
    setHasMore(newMessages.length === MESSAGES_LIMIT);
  };

  // Handle the onScroll event
  const handleScroll = (event) => {
    const { scrollTop } = event.target; // Get the scroll top position

    // Check if scrolled to the top and if more messages are available
    if (scrollTop === 0 && hasMore) {
      loadMoreMessages();
    }
  };

  return (
    <Chat
      navbar={{ title: "Assistant" }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
      locale="en-US"
      placeholder="Type a message..."
      loadMoreText="scroll to load more"
      onScroll={handleScroll}
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
  );
};

export default ChatApp;

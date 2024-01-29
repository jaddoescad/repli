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
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../supabase/auth";


const ChatApp = ({
  myAddress,
  recipientAddress,
}: {
  myAddress: string;
  recipientAddress: string;
}) => {
  const { messages, appendMsg, setTyping, deleteMsg, prependMsgs} = useMessages([]);
  const chatRoomId = getChatRoomId(myAddress, recipientAddress);
  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);
  const [page, setPage] = useState(1); // Add a page state
  const [hasMore, setHasMore] = useState(true); //
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const MESSAGES_LIMIT = 5; // Define the limit as a constant

  

  // Define the function to fetch and append messages
  const formatTransactionMessage = (message) => {
    const formattedValue = message.wei_value && (parseInt(message.wei_value) / 1e11).toFixed(2);
    const responseText = message.sender === myAddress ? "Awaiting response" : "Respond and Earn";

    return {
      type: "custom",
      content: {
        component: (
          <Card>
            <div className="h-20 p-2 pb-4">
              <CardMedia
                className="!bg-contain"
                aspectRatio="wide"
                image="../money-bag.png"
              />
            </div>
            <CardTitle title={responseText} />
            <CardText>
              {message.transaction_hash
                ? `${formattedValue} USDC`
                : "Pending Transaction..."}
            </CardText>
            {/* Add CardActions if needed */}
          </Card>
        ),
      },
      position: message.sender === myAddress ? "right" : "left",
    };
  };

  // Define the function to fetch and prepend messages
  const initializeChat = async () => {
    setIsLoading(true);
    let initialMessages = await fetchInitialMessages(supabase, chatRoomId, page, MESSAGES_LIMIT);
    
    initialMessages = initialMessages.reverse();

    const formattedMessages = initialMessages.flatMap((message) => {
      const formattedMessage = {
        type: "text",
        content: { text: message.message },
        position: message.sender === myAddress ? "right" : "left",
      };

      // Prepare an array to collect the formatted messages
      const messageParts = [formattedMessage];

      // If the message has a transaction, format and add the transaction message
      if (message.transaction_hash) {
        const transactionMessage = formatTransactionMessage(message);
        messageParts.push(transactionMessage);
      }

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


  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "Bala bala" },
        });
      }, 1000);
    }
  }

  function renderMessageContent(msg) {
    const { content, type } = msg;

    switch (type) {
      case "text":
        return <Bubble content={content.text} />;
      case "custom":
        return content.component;
      default:
        return null;
    }
  }

  const loadMoreMessages = async () => {
    if (!hasMore || isLoading) return;
  
    setIsLoading(true); // Set loading state to true while fetching
    const newMessages = await fetchInitialMessages(supabase, chatRoomId, page + 1, MESSAGES_LIMIT);
      
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
      
      renderBeforeMessageList={() => (
        isLoading && <div className="flex justify-center items-center">
          <p
            className="text-xl font-bold text-center"
            style={{ color: "#F2B25D" }}
          >
            Loading...
          </p>
        </div>
      )}
      
    />
  );
};

export default ChatApp;

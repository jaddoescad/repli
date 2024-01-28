import Chat, {
  Bubble,
  Card,
  CardMedia,
  CardText,
  CardTitle,
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
import { useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { access_token_cookie, getSupabase } from "../supabase/auth";

const ChatApp = ({
  myAddress,
  recipientAddress,
}: {
  myAddress: string;
  recipientAddress: string;
}) => {
  const { messages, appendMsg, setTyping } = useMessages([]);
  const chatRoomId = getChatRoomId(myAddress, recipientAddress);
  const supabase = useMemo(() => {
    const accessToken = Cookies.get(access_token_cookie);
    return getSupabase(accessToken || "");
  }, []);

  useEffect(() => {
    // Define the function to fetch and append messages
    const initializeChat = async () => {
      // Fetch initial messages
      const initialMessages = await fetchInitialMessages(
        supabase,
        chatRoomId,
        1,
        5
      );

      // Format and append messages to the chat
      initialMessages.forEach((message) => {
        const formattedMessage = {
          type: "text",
          content: { text: message.message },
          position: message.sender === myAddress ? "right" : "left", // Adjust based on the sender
          // Add other message properties as needed
        };
        appendMsg(formattedMessage);

        // Check if the message has a related transaction
        if (message.transaction_hash) {
          appendTransactionMessage(message);
        }
      });
    };

    // Call the function to initialize chat
    if (myAddress && recipientAddress) {
      initializeChat();
    }
  }, [myAddress, recipientAddress, supabase, chatRoomId, appendMsg]);

  // Function to format and append transaction messages
  const appendTransactionMessage = (message) => {
    const formattedValue =
      message.wei_value && (parseInt(message.wei_value) / 1e11).toFixed(2);
    const responseText =
      message.sender === myAddress ? "Awaiting response" : "Respond and Earn";

    const transactionMessage = {
      type: "custom", // Indicate that this is a custom message type
      content: {
        // Use Card component to display transaction details
        component: (
          <Card>
            <div
                className="h-20 p-2 pb-4"
            >
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

    appendMsg(transactionMessage);
  };

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

  return (
    <Chat
      navbar={{ title: "Assistant" }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};

export default ChatApp;

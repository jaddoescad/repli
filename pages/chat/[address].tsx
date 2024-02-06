import dynamic from "next/dynamic";
import "@chatui/core/dist/index.css";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

// Dynamic imports
const ChatComponentWithNoSSR = dynamic(
  () => import("../../components/ChatComponent"), // adjust the path to where your ChatComponent is located
  { ssr: false }
);

const ChatPage = () => {
  const router = useRouter();
  const { address: recipientAddress } = router.query;
  const myAddress = useAddress();

  return (
    <div className="bg-red-400 h-full">
      {myAddress && recipientAddress && (
        <ChatComponentWithNoSSR
          myAddress={myAddress}
          recipientAddress={recipientAddress as string}
        />
      )}
    </div>
  );
};

export default ChatPage;

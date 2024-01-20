import { useBalance } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { CustomWalletButton } from "./CustomWalletButton";
import { IoChevronBackSharp } from "react-icons/io5";

export const TopChatNavigation = ({
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
  
import { format } from "date-fns";

export const MessageBubble = ({ message, isMine, created_at }) => {


  return (
    <div className={`${isMine ? "text-right" : ""}`}>
      <div
        style={isMine ? { backgroundColor: "#A873E8" } : {}}
        className={`p-3 mx-3 mb-1 mt-6 rounded-2xl text-white tracking-wide text-sm ${
          isMine ? "ml-auto bg-purple-600" : "bg-gray-200"
        } max-w-xs break-words inline-block`}
      >
        <p>{message}</p>
        <span style={{ fontSize: "0.75rem" }} className=" text-gray-200">
          {format(new Date(created_at), "hh:mm a")}
        </span>
      </div>
    </div>
  );
};

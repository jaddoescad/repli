
export const MessageBubble = ({
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
  

  export const TransactionMessage = ({
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
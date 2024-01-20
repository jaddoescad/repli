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
        <style jsx>{`
          .bubble {
            background-color: #f0f0f0;
            margin: 10px;
            padding: 10px;
            border-radius: 10px;
            justify-content: space-between;
            display: block;
            width: fit-content;
            max-width: 250px; /* max width for the bubble */
            overflow-wrap: break-word; /* ensures words can be broken and wrap */
          }
          .mine {
            background-color: #a0c4ff;
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  };
  
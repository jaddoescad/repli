import React from "react";

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
  const formattedValue = weiValue && (parseInt(weiValue) / 1e11).toFixed(2);
  const responseText = isMine ? "Awaiting response" : "Respond and Earn"; // Changed text based on isMine

  return (
    <div className={` ${isMine ? "text-right" : ""}`}>
      <div
        style={isMine ? { backgroundColor: "#A873E8", fontSize: "10px" } : {}}
        className={`p-3 mx-3 rounded-2xl text-white font-medium tracking-wide ${
          isMine ? "ml-auto bg-purple-600" : "bg-gray-200"
        } max-w-xs break-words inline-block`}
      >
        {hash ? (
          // When hash is present, show full details
          <div className="flex">
            <img
              src="../money-bag.png"
              alt="Logo"
              className="logo"
              style={{ height: "50px" }}
            />
            <div className="ml-4">
              <p className="text-base">{responseText}</p> {/* Use responseText here */}
              <p
                style={{ color: "#F2B25D" }}
                className="text-xl font-bold text-left"
              >
                {`${formattedValue} USDC`}
              </p>
            </div>
          </div>
        ) : (
          // When hash is not present, show "Pending Transaction..."
          <div className="flex justify-center items-center" style={{ height: '100%' }}>
            <p className="text-xl font-bold text-center" style={{ color: "#F2B25D" }}>
              Pending Transaction...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

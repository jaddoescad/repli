import { Card, CardMedia, CardText, CardTitle } from "@chatui/core";
import React from "react";

// Define the function to fetch and append messages
export const formatTransactionMessage = (message, myAddress) => {
  if (!message.transaction_hash) {
    // If there's no transaction hash, display a "pending transaction" message
    return {
      _id: "transaction_" + message.id,
      type: "text",
      content: { text: "Pending Transaction..." },
      position: message.sender === myAddress ? "right" : "left",
      status: "loading", // Optional: to indicate loading state
    };
  } else {
    // Format and display the transaction message as before
    const formattedValue =
      message.wei_value && (parseInt(message.wei_value) / 1e11).toFixed(2);
    const responseText =
      message.sender === myAddress ? "Awaiting response" : "Respond and Earn";

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
            <CardText>{`${formattedValue} USDC`}</CardText>
            {/* Add CardActions if needed */}
          </Card>
        ),
      },
      position: message.sender === myAddress ? "right" : "left",
    };
  }
};

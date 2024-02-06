import { ethers } from "ethers";

// Updated sendMoney function
export const sendMoney = async (
  mutateAsync, // Function to execute the contract write operation
  weiValue, // Amount to be sent (in wei)
  messageId, // ID of the message being responded to
  responseBucketId, // ID of the response bucket
  sender, // Address of the sender
  receiver // Address of the receiver (claimant)
) => {
  console.log("sendMoney", weiValue, messageId, responseBucketId, receiver);

  // Convert the value to BigNumber format using ethers.js
  weiValue = ethers.utils.parseEther(weiValue.toString());

  // Execute the contract write operation with the updated parameters
  const myData = await mutateAsync({
    args: [messageId, responseBucketId, receiver], // Update arguments as per contract
    overrides: {
      gasLimit: 1000000, // Gas limit for the transaction
      value: weiValue, // Value being sent with the transaction
    },
  });

  return myData;
};

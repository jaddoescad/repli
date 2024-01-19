import { ethers } from "ethers";

//crearee function for the above
export const sendMoney = async (
  mutateAsync: any,
  weiValue: any,
  messageId: any,
  sender: any,
  receiver: any
) => {
  console.log("sendMoney", weiValue, messageId, receiver);
  weiValue = ethers.utils.parseEther(weiValue.toString());

  const myData = await mutateAsync({
    args: [messageId, receiver],
    overrides: {
      gasLimit: 1000000,
      value: weiValue,
    },
  });

  return myData;
};

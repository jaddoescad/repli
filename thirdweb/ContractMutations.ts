import { ethers } from "ethers";

//crearee function for the above
export const sendMoney = async (
  mutateAsync: any,
  weiValue: any,
  messageId: any,
  receiver: any
) => {

  const myData = await mutateAsync({
    args: [1, "0x57f2AA8FEB4644D5684dA36c796A39A5f7C93Df4"],
    overrides: {
      gasLimit: 1000000,
      value: weiValue,
    },
  });

  console.log("myData", myData);
  return myData;
};



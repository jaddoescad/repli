// import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatContractAddress } from "../../../contract-addresses";
import initializeFirebaseServer from "../../../firebase/initFirebaseAdmin";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
const sdk = new ThirdwebSDK("mumbai");

// import {ThirdwebAuthHandler} from '../thirdWebAuth/[...thirdweb]'
// import { getUser } from '../thirdWebAuth/[...thirdweb]'

//this is a nextjs api route
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const contract = await sdk.getContract(ChatContractAddress);

    // Listen to events
    contract.events.listenToAllEvents((event) => {
      console.log(event.eventName, event.data);
    });

    response.status(200).json({ message: "Listening to contract events..." });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
}

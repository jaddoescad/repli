import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import initializeFirebaseServer from "../../../firebase/initFirebaseAdmin";
import jwt from "jsonwebtoken";

const users: Record<string, any> = {};

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain:
    process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "http://localhost:3000",
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  callbacks: {
    onLogin: async (address) => {
      // Initialize the Firebase Admin SDK.
      const { auth } = initializeFirebaseServer();

      // Generate a JWT token for the user to be used on the client-side.
      const token = await auth.createCustomToken(address);

      return { firtoken: token };
    }
  },
});

export default ThirdwebAuthHandler();



// import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
// import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
// import initializeFirebaseServer from "../../../lib/initFirebaseAdmin";
// import jwt from "jsonwebtoken";

// const users: Record<string, any> = {};

// export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
//   domain:
//     process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "http://localhost:3000",
//   wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
//   callbacks: {
//     onLogin: async (address) => {
//       // Initialize the Firebase Admin SDK.
//       const { auth } = initializeFirebaseServer();

//       // Generate a JWT token for the user to be used on the client-side.
//       const token = await auth.createCustomToken(address);

//       return {
//         token,
//       };
//     },
//     onToken: async (token, req) => {
//       const { auth } = initializeFirebaseServer();
//       const firtoken = await auth.createCustomToken(req.body.address);

//       return {
//         token: firtoken
//       };
//     },
//   },
// });

// export default ThirdwebAuthHandler();

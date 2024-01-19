import { BigNumber } from "ethers";
import { JWT } from "next-auth/jwt";

export interface TwitterExtendedUser {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
  }
  
  export interface ExtendedJWT extends JWT {
    user?: TwitterExtendedUser;
  }

  export interface ChatUser {
    twitter_name: string;
    twitter_handle: string;
    avatar_url: string;
  }

  export type WalletData = {
    value: string | BigNumber; // Handle BigNumber type for value
    name: string;
    symbol?: string; // Optional
    decimals?: number; // Optional
    displayValue?: string; // Optional
  };
  
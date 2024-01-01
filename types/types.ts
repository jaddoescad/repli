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
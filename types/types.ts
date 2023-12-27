import { JWT } from "next-auth/jwt";

export interface ExtendedUser {
    id: string;
    username: string;
    name: string;
  }
  
  export interface ExtendedJWT extends JWT {
    user?: ExtendedUser;
  }
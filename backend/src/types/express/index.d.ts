import { User } from "../../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
      token?: string; 
      ipAddress?: string; 
      session_id: string;
    }
  }
}

export {};

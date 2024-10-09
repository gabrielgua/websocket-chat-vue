import type { User } from "./user.type";

export interface Message {
  id: number;
  chat: string;
  sender: User;
  content: string;
  timestamp: Date;
}

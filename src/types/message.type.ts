import type { User } from "./user.type";

export type Message = {
  id: number;
  chat: string;
  sender: User;
  content: string;
  timestamp: Date;
};

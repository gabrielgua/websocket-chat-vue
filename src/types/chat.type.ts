import type { Message } from "./message.type";
import type { User } from "./user.type";

export enum ChatType {
  private = "PRIVATE",
  group = "GROUP",
}

export enum ChatFilter {
  all = "ALL",
  private = "PRIVATE",
  group = "GROUP",
}

export type ChatStatusCount = {
  online: number;
  offline: number;
  members: number;
};

export type Chat = {
  id: string;
  name: string;
  description: string;
  creator: User;
  imageUrl: string;
  type: ChatType;
  createdAt: Date;
  statusCount: ChatStatusCount;
  lastMessage: Message;
  receiver?: User;
  notifications: number;
  abreviation?: string;
  users: User[];
};

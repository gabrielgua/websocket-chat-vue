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

export interface ChatStatusCount {
  online: number;
  offline: number;
  members: number;
}

export interface Chat {
  id: string;
  name: string;
  description: string;
  creator: User;
  type: ChatType;
  createdAt: Date;
  statusCount: ChatStatusCount;
  lastMessage: Message;
  receiver?: User;
  notifications: number;
  abreviation?: string;
}

export interface ChatShort {
  id: string;
  statusCount: ChatStatusCount;
  receiver?: User;
}

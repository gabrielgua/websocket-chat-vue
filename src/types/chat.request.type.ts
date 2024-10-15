import type { ChatType } from "./chat.type";

export type ChatRequest = {
  name: string;
  description?: string;
  type: ChatType;
  users: number[];
};

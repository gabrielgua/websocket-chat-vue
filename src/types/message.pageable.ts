import type { Message } from "./message.type";

export type MessagePageable = {
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  content: Message[];
};

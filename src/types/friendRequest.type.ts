import type { User } from "./user.type";

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type FriendRequestId = {
  requesterId: number;
  receiverId: number;
};

export type FriendRequest = {
  id: FriendRequestId;
  receiver?: User;
  requester?: User;
  status: FriendRequestStatus;
  createdAt: Date;
};

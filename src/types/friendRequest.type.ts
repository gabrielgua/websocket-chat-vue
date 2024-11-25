import type { User } from "./user.type";

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type FriendRequest = {
  receiver?: User;
  requester?: User;
  status: FriendRequestStatus;
  createdAt: Date;
};

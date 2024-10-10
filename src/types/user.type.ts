export enum UserStatus {
  Offline = "OFFLINE",
  Online = "ONLINE",
}

export interface User {
  id: number;
  name: string;
  username: string;
  status: UserStatus;
  avatarUrl: string;
  color?: string;
}

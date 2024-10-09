export enum UserStatus {
  Offline = "OFFLINE",
  Online = "ONLINE",
}

export interface User {
  id: number;
  name: string;
  username: string;
  status: UserStatus;
  color?: string;
}

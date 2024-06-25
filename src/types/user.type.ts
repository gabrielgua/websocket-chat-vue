export enum UserStatus {
    Offline = 'OFFLINE',
    Online = 'ONLINE'
}

export interface User {
    id: number,
    username: string,
    status: UserStatus
}
enum UserStatus {
    Offline = 'OFFLINE',
    Online = 'Online'
}

export interface User {
    id: number,
    username: string,
    status: UserStatus
}
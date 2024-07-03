export enum ChatType {
    Private = "PRIVATE", 
    Group = "GROUP"  
}

export interface Chat {
    id: string,
    name: string,
    type: ChatType,
    created_at: Date,
    online: number,
    offline: number,
    members: number
}
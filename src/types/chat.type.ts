export enum ChatType {
    PRIVATE, GROUP
}

export interface Chat {
    id: string,
    name: string,
    type: ChatType,
    created_at: Date
}
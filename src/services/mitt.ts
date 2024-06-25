import mitt from "mitt";

type Events = {
    message: string,
    connected: string,
    disconnected: string,
    statusNotification: string,
}


export const emitter = mitt<Events>();
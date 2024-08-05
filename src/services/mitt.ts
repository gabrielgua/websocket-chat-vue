import mitt from "mitt";

type Events = {
    message: string,
    connected: string,
    disconnected: string,
    notification: string,
}


export const emitter = mitt<Events>();
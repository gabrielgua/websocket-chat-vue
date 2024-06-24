import mitt from "mitt";

type Events = {
    stompConnected: string,
    messageReceived: string,
}

export const emitter = mitt<Events>();
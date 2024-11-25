import mitt from "mitt";

type Events = {
  message: string;
  connected: string;
  disconnected: string;
  notification: string;
  chatCreated: string;

  requestReceived: string;
};

export const emitter = mitt<Events>();

import mitt from "mitt";

type Events = {
  message: string;
  connected: string;
  disconnected: string;
  notification: string;
  chatCreated: string;
  chatConnectionNotification: string;

  requestNotification: string;
  connectionNotification: string;
};

export const emitter = mitt<Events>();

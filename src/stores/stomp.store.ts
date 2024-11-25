import { emitter } from "@/services/mitt";
import { defineStore } from "pinia";
import Stomp, { type Message } from "stompjs";
import { reactive, ref, type Ref } from "vue";
import { useChatStore } from "./chat.store";
import { useAuthStore } from "./auth.store";
import { useUnreadStore } from "./unread.store";
import type { FriendRequest } from "@/types/friendRequest.type";

export const useStompStore = defineStore("stomp", () => {
  const chatStore = useChatStore();
  const authStore = useAuthStore();
  const unreadStore = useUnreadStore();
  const state = reactive({ loading: false, error: false });
  const subscriptions: Ref<Stomp.Subscription[]> = ref([]);
  let stomp = Stomp.client("");

  function connect() {
    stomp = Stomp.over(new WebSocket("ws://localhost:8080/ws"));
    stomp.connect(
      { Authorization: `Bearer ${authStore.authentication.token}` },
      onConnected,
      onError
    );
  }

  function onError() {
    console.log("error connecting to websocket server");
  }

  function onConnected() {
    if (!subscriptions.value.length) {
      emitter.emit("connected", "User connected");
      subscribePublicNotifications();

      chatStore
        .fetchChats()
        .then(() => {
          subscribeAll();
          unreadStore.fetch();
        })
        .finally(() => (state.loading = false));
    }
  }

  function handleNotification(message: Stomp.Message) {
    emitter.emit("notification", message.body);
  }

  function handleRequestReceived(message: Stomp.Message) {
    emitter.emit("requestReceived", message.body);
  }

  function subscribePublicNotifications() {
    const publicSub = stomp.subscribe(
      "/topic/notifications",
      handleNotification
    );
    const requestSub = stomp.subscribe(
      `/user/${authStore.authentication.username}/request-notifications`,
      () => {}
    );

    subscriptions.value.push(publicSub);
    subscriptions.value.push(requestSub);
  }

  function subscribeAll() {
    chatStore.chats.forEach((chat) => {
      subscriptions.value.push(subscribe(chat.id));
    });
  }

  function unsubscribeAll() {
    subscriptions.value.forEach((sub) => {
      stomp.unsubscribe(sub.id);
    });
    subscriptions.value = [];
  }

  function subscribe(chat: string) {
    return stomp.subscribe(`/topic/chats/${chat}`, emitReceived);
  }

  function emitReceived(message: Stomp.Message) {
    emitter.emit("message", message.body);
  }

  function send(topic: string, payload: Object) {
    stomp.send(topic, {}, JSON.stringify(payload));
  }

  function disconnectAndUnsubscribe(): Promise<string> {
    return new Promise((resolve) => {
      emitter.emit("disconnected", "disconnected");

      unsubscribeAll();
      stomp.disconnect(() => undefined);

      resolve("disconnected from server");
    });
  }

  return {
    stomp,
    send,
    connect,
    subscribe,
    subscribeAll,
    disconnectAndUnsubscribe,
  };
});

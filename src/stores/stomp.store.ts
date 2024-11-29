import { emitter } from "@/services/mitt";
import { defineStore } from "pinia";
import Stomp, { type Message } from "stompjs";
import { reactive, ref, type Ref } from "vue";
import { useChatStore } from "./chat.store";
import { useAuthStore } from "./auth.store";
import { useUnreadStore } from "./unread.store";
import type { FriendRequest } from "@/types/friendRequest.type";
import type { Chat } from "@/types/chat.type";

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
    emitter.emit("requestNotification", message.body);
  }

  function handleConnectionNotification(message: Stomp.Message) {
    emitter.emit("connectionNotification", message.body);
  }

  function subscribePublicNotifications() {
    const publicSub = stomp.subscribe(
      "/topic/notifications",
      handleNotification
    );
    const requestSub = stomp.subscribe(
      `/user/${authStore.authentication.username}/request-notifications`,
      handleRequestReceived
    );
    const connectionSub = stomp.subscribe(
      `/user/${authStore.authentication.username}/connection-notifications`,
      handleConnectionNotification
    );

    subscriptions.value.push(publicSub);
    subscriptions.value.push(requestSub);
    subscriptions.value.push(connectionSub);
  }

  function subscribeAll() {
    chatStore.chats.forEach((chat) => {
      subscribeToChat(chat);
    });
  }

  const subscribeToChat = (chat: Chat) => {
    const chatSub = stomp.subscribe(
      `/topic/chats/${chat.id}`,
      handleChatNotification
    );
    const chatConnectionSub = stomp.subscribe(
      `/topic/chats/${chat.id}/connection-notifications`,
      handleChatConnectionNotification
    );

    subscriptions.value.push(chatSub);
    subscriptions.value.push(chatConnectionSub);
  };

  const handleChatConnectionNotification = (message: Stomp.Message) => {
    emitter.emit("chatConnectionNotification", message.body);
  };

  function unsubscribeAll() {
    subscriptions.value.forEach((sub) => {
      stomp.unsubscribe(sub.id);
    });
    subscriptions.value = [];
  }

  function subscribe(chat: string) {
    return stomp.subscribe(`/topic/chats/${chat}`, handleChatNotification);
  }

  function handleChatNotification(message: Stomp.Message) {
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

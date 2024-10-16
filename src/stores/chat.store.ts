import { http } from "@/services/http";
import { emitter } from "@/services/mitt";
import type { ChatRequest } from "@/types/chat.request.type";
import { ChatType, type Chat, type ChatShort } from "@/types/chat.type";
import type { Message } from "@/types/message.type";
import { UserStatus } from "@/types/user.type";
import { getRadomColor } from "@/utils/colors";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const ENDPOINT = "/api/chats";

  const chats = ref<Chat[]>([]);
  const current = ref<Chat>({} as Chat);
  const state = reactive({ loading: false, error: false });

  function fetchChats() {
    state.loading = true;
    chats.value = [];
    return http
      .get(ENDPOINT)
      .then((response) => {
        state.error = false;
        response.data.map((chat: Chat) => {
          chats.value.push(chat);
        });

        sortChatList();
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => {
        state.loading = false;
      });
  }

  function changeCurrent(chat: Chat) {
    current.value = chat;
  }

  function currentIsEmpty() {
    return Object.keys(current.value).length === 0;
  }

  function find(chatId: string) {
    return chats.value.find((chat) => chat.id === chatId);
  }

  function fetchChatStatusCount() {
    http.get(`${ENDPOINT}/status`).then((response) => {
      response.data.map((short: ChatShort) => {
        const chat = find(short.id);
        const index = chats.value.findIndex((c) => c.id === short.id);
        if (chat && index != -1) {
          if (chat.type === ChatType.private) {
            chat.receiver = short.receiver;
            return;
          }

          chat.statusCount.online = short.statusCount.online;
          chat.statusCount.members = short.statusCount.members;
          chat.statusCount.offline = short.statusCount.offline;
        }
      });
    });
  }

  function updateLastMessage(message: Message) {
    const chat = chats.value.find((c) => c.id === message.chat);
    if (chat) {
      chat.lastMessage = message;
    }
  }

  function sortChatList() {
    chats.value = chats.value.sort((a: Chat, b: Chat) => {
      if (hasLastMessage(a) && hasLastMessage(b)) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      } else if (hasLastMessage(a)) {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      } else if (hasLastMessage(b)) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
  }

  function hasLastMessage(chat: Chat) {
    return Object.keys(chat.lastMessage).length;
  }

  function isReceiverOnline(chat: Chat) {
    if (chat.receiver) {
      return chat.receiver.status === UserStatus.Online;
    }
  }

  function isGroupChat(chat: Chat) {
    return chat.type === ChatType.group;
  }

  function reset() {
    chats.value = [];
    current.value = {} as Chat;
  }

  function createChat(chat: ChatRequest) {
    state.loading = true;
    state.error = true;

    http
      .post(ENDPOINT, chat)
      .then((response) => {
        chats.value.push(response.data);

        sortChatList();

        emitter.emit("chatCreated", response.data);
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => (state.loading = false));
  }

  return {
    reset,
    chats,
    current,
    changeCurrent,
    state,
    fetchChats,
    fetchChatStatusCount,
    createChat,
    updateLastMessage,
    sortChatList,
    isReceiverOnline,
    isGroupChat,
    find,
    currentIsEmpty,
  };
});

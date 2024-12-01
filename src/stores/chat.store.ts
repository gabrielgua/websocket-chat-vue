import { http } from "@/services/http";
import { emitter } from "@/services/mitt";
import type { ChatRequest } from "@/types/chat.request.type";
import { ChatType, type Chat } from "@/types/chat.type";
import type { MessageRequest } from "@/types/message.request.type";
import type { Message } from "@/types/message.type";
import { UserStatus, type User } from "@/types/user.type";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const CHATS_ENDPOINT = "/api/chats";

  const chats = ref<Chat[]>([]);
  const current = ref<Chat>({} as Chat);
  const state = reactive({ loading: false, error: false });

  function fetchChats() {
    state.loading = true;
    state.error = false;

    return http
      .get(CHATS_ENDPOINT)
      .then((response) => {
        chats.value = response.data;
        chats.value.forEach((chat) => (chat.messages = []));

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

  const fetchChatMessages = (chat: Chat) => {
    if (chat.messages?.length) {
      return;
    }

    return http
      .get(`/api/chats/${chat.id}/messages`)
      .then((response) => {
        chat.messages = response.data;
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  };

  const fetchChatUsers = (chat: Chat) => {
    if (isPrivate()) {
      return;
    }

    http.get(`${CHATS_ENDPOINT}/${chat.id}/users`).then((res) => {
      current.value.users = res.data;
      updateChatStatus();
    });
  };

  function changeCurrent(chat: Chat) {
    current.value = chat;
    fetchChatMessages(chat);
    updateChatStatus();
  }

  function currentIsEmpty() {
    return Object.keys(current.value).length === 0;
  }

  function findChat(chatId: string) {
    return chats.value.find((chat) => chat.id === chatId);
  }

  const updateChatUserStatus = (user: User) => {
    if (isPrivate() && current.value.receiver) {
      current.value.receiver.status = user.status;
      return;
    }

    if (current.value.users) {
      const exists = current.value.users.find((u) => u.id === user.id);
      if (exists) {
        exists.status = user.status;
        updateChatStatus();
      }
    }
  };

  const updateChatStatus = () => {
    if (isPrivate()) {
      return;
    }

    if (current.value.users) {
      const members = current.value.users.length;
      const online = current.value.users.filter(
        (u) => u.status === UserStatus.Online
      ).length;

      const offline = members - online;

      current.value.statusCount.members = members;
      current.value.statusCount.online = online;
      current.value.statusCount.offline = offline;
    }
  };

  function sendMessage(message: MessageRequest) {
    http
      .post(`/api/chats/${message.chatId}/messages`, message)
      .then(() => console.log("Message sent!"));
  }

  const addMessage = (message: Message) => {
    const chat = chats.value.find((c) => c.id === message.chat);
    if (chat) {
      chat.messages.push(message);
      chat.lastMessage = message;
    }
  };

  const updateLastMessage = (message: Message) => {
    console.log("lastMessage", message.content);
    const chat = chats.value.find((c) => c.id === message.chat);
    if (chat) {
      chat.lastMessage = message;
    }
  };

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

  function isGroup(chat?: Chat) {
    if (chat) {
      return chat.type === ChatType.group;
    }

    return current.value.type === ChatType.group;
  }

  const isPrivate = (chat?: Chat) => {
    if (chat) {
      return chat.type === ChatType.private;
    }

    return current.value.type === ChatType.private;
  };

  function reset() {
    chats.value = [];
    current.value = {} as Chat;
  }

  function createChat(chat: ChatRequest) {
    state.loading = true;
    state.error = true;

    http
      .post(CHATS_ENDPOINT, chat)
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

  const findPrivateByReceiver = (receiverId: number) => {
    return chats.value.find((chat) => chat.receiver?.id === receiverId);
  };

  return {
    reset,
    chats,
    current,
    changeCurrent,
    state,
    fetchChats,
    fetchChatUsers,
    createChat,
    sortChatList,
    isReceiverOnline,
    updateChatUserStatus,
    isGroup,
    isPrivate,
    findChat,
    currentIsEmpty,
    sendMessage,
    findPrivateByReceiver,
    fetchChatMessages,
    addMessage,
    updateLastMessage,
  };
});

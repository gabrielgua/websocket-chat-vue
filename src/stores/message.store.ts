import { http } from "@/services/http";
import type { MessagePageable } from "@/types/message.pageable";
import type { Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { useAuthStore } from "./auth.store";

type PageableState = {
  chatId: string;
  maxPageReached: number;
};

export const useMessageStore = defineStore("message", () => {
  const pageSize = 20;
  const pageNumber = 0;

  const pageable = ref<MessagePageable>();
  const messages = computed<Message[]>(() => {
    if (!pageable.value) {
      return [];
    }

    return pageable.value.content.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });

  const authStore = useAuthStore();
  const state = reactive({ loading: false, error: false });

  function add(message: Message) {
    if (!pageable.value) {
      return;
    }
    pageable.value.content.push(message);
  }

  function fetchMessagesForChat(chat: string) {
    state.loading = true;

    http
      .get(`/api/chats/${chat}/messages?size=${pageSize}&page=${pageNumber}`)
      .then((res) => (pageable.value = res.data))
      .catch((e) => {
        state.error = true;
        console.error(e);
      })
      .finally(() => (state.loading = false));
  }

  function isSender(message: Message) {
    return authStore.authentication.userId === message.sender.id;
  }

  const reset = () => {
    if (!pageable.value) return;

    pageable.value.content = [];
    state.error = false;
    state.loading = false;
  };

  return { messages, state, fetchMessagesForChat, reset, add, isSender };
});

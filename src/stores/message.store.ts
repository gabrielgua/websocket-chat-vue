import { http } from "@/services/http";
import type { Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import { useAuthStore } from "./auth.store";
import { useUserStore } from "./user.store";

export const useMessageStore = defineStore("message", () => {
  const messages: Ref<Message[]> = ref([]);
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const state = reactive({ loading: false, error: false });

  function reset() {
    messages.value = [];
    state.error = false;
    state.loading = false;
  }

  function add(message: Message) {
    messages.value.push(message);
  }

  function fetchMessages(chat: string) {
    state.loading = true;
    messages.value = [];

    return http
      .get(`/web/chats/${chat}/messages`)
      .then((response) => {
        response.data.map((message: Message) => {
          messages.value.push(message);

          userStore.setUserColor(message.sender);
        });
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => (state.loading = false));
  }

  function isSender(message: Message) {
    return authStore.authentication.userId === message.sender.id;
  }

  return { messages, state, fetchMessages, reset, add, isSender };
});

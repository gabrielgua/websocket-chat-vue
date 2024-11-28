import type { RequestListType } from "@/components/Aside/Request/RequestList.vue";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useChatStore } from "./chat.store";
import type { User } from "@/types/user.type";

export type AsideType = "profile" | "chats" | "requests" | "friends";

export const useAsideStore = defineStore("aside", () => {
  const chatStore = useChatStore();

  const currentMenu = ref<AsideType>("friends");
  const currentRequestType = ref<RequestListType>("sent");

  const changeRequestType = (type: RequestListType) => {
    currentRequestType.value = type;
  };

  const changeMenu = (to: AsideType) => {
    currentMenu.value = to;
  };

  const reset = () => {
    currentMenu.value = "chats";
    currentRequestType.value = "sent";
  };

  const goToUserChat = (user: User) => {
    changeMenu("chats");
    const chat = chatStore.findPrivateByReceiver(user.id);
    if (chat) {
      chatStore.changeCurrent(chat);
    }
  };

  return {
    currentMenu,
    currentRequestType,
    changeMenu,
    changeRequestType,
    reset,
    goToUserChat,
  };
});

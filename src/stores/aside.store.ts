import type { RequestListType } from "@/components/Aside/Request/RequestList.vue";
import { defineStore } from "pinia";
import { ref } from "vue";

export type AsideType = "profile" | "chats" | "requests" | "friends";

export const useAsideStore = defineStore("aside", () => {
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

  return {
    currentMenu,
    currentRequestType,
    changeMenu,
    changeRequestType,
    reset,
  };
});

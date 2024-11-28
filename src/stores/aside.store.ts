import { defineStore } from "pinia";
import { ref } from "vue";

export type AsideType = "profile" | "chats" | "requests";

export const useAsideStore = defineStore("aside", () => {
  const current = ref<AsideType>("chats");

  const changeCurrent = (to: AsideType) => {
    current.value = to;
  };

  const reset = () => {
    current.value = "chats";
  };

  return { current, changeCurrent, reset };
});

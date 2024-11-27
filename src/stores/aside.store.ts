import { defineStore } from "pinia";
import { ref } from "vue";

export type AsideType = "profile" | "chats" | "requests";

export const useAsideStore = defineStore("aside", () => {
  const current = ref<AsideType>("requests");

  const changeCurrent = (to: AsideType) => {
    current.value = to;
  };

  return { current, changeCurrent };
});

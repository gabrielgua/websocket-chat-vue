import { UserStatus, type User } from "@/types/user.type";
import { getRadomColor } from "@/utils/colors";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);

  function setUserColor(user: User) {
    if (users.value.find((u) => u.id === user.id)) {
      return;
    }

    user.color = getRadomColor("text");
    users.value.push(user);
  }

  function getUserColor(user: User) {
    if (!users.value.find((u) => u.id === user.id)) {
      return;
    }

    const index = users.value.findIndex((u) => u.id === user.id);
    return users.value[index].color;
  }

  function isOnline(user: User) {
    return user.status === UserStatus.Online;
  }

  function reset() {
    users.value = [];
  }

  return {
    users,
    setUserColor,
    getUserColor,
    isOnline,
    reset,
  };
});

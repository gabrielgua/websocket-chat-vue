import { UserStatus, type User } from "@/types/user.type";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);

  const colors = [
    "text-sky-600",
    "text-red-400",
    "text-pink-400",
    "text-teal-400",
    "text-orange-800",
    "text-yellow-400",
    "text-emerald-400",
    "text-violet-800",
    "text-rose-900",
  ];

  function setUserColor(user: User) {
    if (users.value.find((u) => u.id === user.id)) {
      return;
    }

    user.color = getRadomColor();
    users.value.push(user);
  }

  function getUserColor(user: User) {
    if (!users.value.find((u) => u.id === user.id)) {
      return;
    }

    const index = users.value.findIndex((u) => u.id === user.id);
    return users.value[index].color;
  }

  function getRadomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }

  function generateNameAbreviation(user: User) {
    const names = user.name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
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
    generateNameAbreviation,
    isOnline,
    reset,
  };
});

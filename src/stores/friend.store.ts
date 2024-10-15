import { http } from "@/services/http";
import type { User } from "@/types/user.type";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useFriendStore = defineStore("friend", () => {
  const ENDPOINT = "/api/users/friends";

  const friends = ref<User[]>([]);
  const state = reactive({ loading: false, error: false });

  function fetchFriends() {
    if (friends.value.length) return;

    startLoading();

    http
      .get(ENDPOINT)
      .then((response) => {
        response.data.map((f: User) => friends.value.push(f));
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => (state.loading = false));
  }

  function startLoading() {
    state.error = false;
    state.loading = true;
  }

  function reset() {
    friends.value = [];
    state.loading = false;
    state.error = false;
  }

  return { state, friends, fetchFriends, reset };
});

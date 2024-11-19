import { http } from "@/services/http";
import type { User } from "@/types/user.type";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useUserSearchStore = defineStore("userSearch", () => {
  const FIND_ENDPOINT = "/api/users";

  const searchUsers = ref<User[]>([]);
  const state = reactive({ loading: false, error: false, empty: false });

  function findByNameOrUsername(term: string) {
    if (!term.length) {
      return;
    }

    state.loading = true;

    setTimeout(() => {
      http
        .get(`${FIND_ENDPOINT}?term=${term}`)
        .then((response) => {
          if (!response.data.length) {
            state.empty = true;
            return;
          }

          state.empty = false;
          searchUsers.value = response.data;
        })
        .catch((e) => {
          console.log(e);
          state.error = true;
        })
        .finally(() => (state.loading = false));
    }, 500);
  }

  function reset() {
    state.error = false;
    state.loading = false;
    state.empty = false;
    searchUsers.value = [];
  }

  return {
    state,
    reset,
    searchUsers,
    findByNameOrUsername,
  };
});

import { http } from "@/services/http";
import type { User } from "@/types/user.type";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useUserSearchStore = defineStore("userSearch", () => {
  const FIND_ENDPOINT = "/api/users";

  const searchUsers = ref<User[]>([]);
  const previousTerm = ref("");
  const state = reactive({ loading: false, error: false, touched: false });

  function findByNameOrUsername(term: string) {
    if (!term.length || previousTerm.value.trim() === term.trim()) {
      return;
    }

    state.loading = true;
    previousTerm.value = term;

    setTimeout(() => {
      http
        .get(`${FIND_ENDPOINT}?term=${term}`)
        .then((response) => {
          searchUsers.value = response.data;
        })
        .catch((e) => {
          console.log(e);
          state.error = true;
        })
        .finally(() => {
          state.loading = false;
          state.touched = true;
        });
    }, 500);
  }

  function reset() {
    state.error = false;
    state.loading = false;
    state.touched = false;
    searchUsers.value = [];
    previousTerm.value = "";
  }

  return {
    state,
    reset,
    searchUsers,
    findByNameOrUsername,
  };
});

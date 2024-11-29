import { http } from "@/services/http";
import { UserStatus, type User } from "@/types/user.type";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useFriendStore = defineStore("friend", () => {
  const ENDPOINT = "/api/users/friends";

  const friends = ref<User[]>([]);

  const state = reactive({ loading: false, error: false });

  const fetchFriends = () => {
    startLoading();

    http
      .get(ENDPOINT)
      .then((response) => {
        friends.value = response.data;
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => (state.loading = false));
  };

  const startLoading = () => {
    state.error = false;
    state.loading = true;
  };

  const reset = () => {
    friends.value = [];
    state.loading = false;
    state.error = false;
  };

  const updateFriendStatus = (user: User) => {
    const friend = friends.value.find((f) => f.id === user.id);
    if (friend) {
      friend.status = user.status;
    }
  };

  const alreadyFriends = (id: number) => {
    return !!friends.value.find((friend) => friend.id === id);
  };

  return {
    state,
    friends,
    fetchFriends,
    reset,
    alreadyFriends,
    updateFriendStatus,
  };
});

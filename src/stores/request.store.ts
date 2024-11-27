import { http } from "@/services/http";
import type { FriendRequest } from "@/types/friendRequest.type";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useRequestStore = defineStore("request", () => {
  const REQUEST_ENPOINT = "/api/users/requests";

  const sent = ref<FriendRequest[]>([]);
  const received = ref<FriendRequest[]>([]);
  const state = reactive({ loading: false, error: false });

  const fetchSent = () => {
    state.loading = true;
    http
      .get(`${REQUEST_ENPOINT}/sent`)
      .then((res) => {
        res.data.map((request: FriendRequest) => sent.value.push(request));
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => (state.loading = false));
  };

  const fetchReceived = () => {
    state.loading = true;
    http
      .get(`${REQUEST_ENPOINT}/received`)
      .then((res) => {
        res.data.map((request: FriendRequest) => received.value.push(request));
      })
      .catch((e) => {
        state.error = true;
        console.log(e);
      })
      .finally(() => (state.loading = false));
  };

  const reset = () => {
    state.error = false;
    state.loading = false;
    received.value = [];
    sent.value = [];
  };

  return { fetchReceived, fetchSent, sent, received, state, reset };
});

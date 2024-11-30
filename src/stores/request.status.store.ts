import { defineStore } from "pinia";
import { useRequestStore } from "./request.store";
import { http } from "@/services/http";
import { reactive, ref } from "vue";

export const useRequestStatusStore = defineStore("requestStatus", () => {
  const initialState = { id: 0, loading: false, error: false };

  const REQUEST_ENPOINT = "/api/users/requests";

  const requestStore = useRequestStore();
  const state = ref(initialState);

  const acceptRequest = (requesterId: number) => {
    request(requesterId);

    setTimeout(() => {
      http
        .post(`${REQUEST_ENPOINT}/accept`, { requesterId })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
          state.value.error = true;
        })
        .finally(() => (state.value.loading = false));
    }, 500);
  };

  const cancelRequest = (receiverId: number) => {
    request(receiverId);

    setTimeout(() => {
      http
        .delete(`${REQUEST_ENPOINT}/cancel`, { data: { receiverId } })
        .then(() => requestStore.removeSent(receiverId))
        .catch((e) => {
          console.log(e);
          state.value.error = true;
        })
        .finally(() => (state.value.loading = false));
    }, 500);
  };

  const request = (id: number) => {
    state.value.id = id;
    state.value.error = false;
    state.value.loading = true;
  };

  const reset = () => {
    state.value = initialState;
  };

  return { state, acceptRequest, cancelRequest };
});

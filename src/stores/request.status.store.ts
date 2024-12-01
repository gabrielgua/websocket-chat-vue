import { defineStore } from "pinia";
import { useRequestStore } from "./request.store";
import { http } from "@/services/http";
import { reactive, ref } from "vue";
import { useToastStore } from "./toast.store";

export const useRequestStatusStore = defineStore("requestStatus", () => {
  const REQUEST_ENPOINT = "/api/users/requests";

  const requestStore = useRequestStore();
  const { append } = useToastStore();
  const state = reactive({
    id: 0,
    loading: false,
    error: false,
    success: false,
  });

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
          state.error = true;
        })
        .finally(() => (state.loading = false));
    }, 500);
  };

  const cancelRequest = (receiverId: number) => {
    request(receiverId);

    setTimeout(() => {
      http
        .delete(`${REQUEST_ENPOINT}/cancel`, { data: { receiverId } })
        .then(() => {
          requestStore.removeSent(receiverId);
          state.success = true;

          append(
            "Request canceled",
            "info",
            "The request was successfully canceled."
          );
          console.log(state);
        })
        .catch((e) => {
          console.log(e);
          state.error = true;
        })
        .finally(() => (state.loading = false));
    }, 500);
  };

  const request = (id: number) => {
    state.id = id;
    state.error = false;
    state.loading = true;
    state.success = false;
  };

  const reset = () => {
    state.id = 0;
    state.success = false;
    state.loading = false;
    state.error = false;
  };

  return { state, acceptRequest, cancelRequest, reset };
});

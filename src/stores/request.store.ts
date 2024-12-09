import { http } from "@/services/http";
import { emitter } from "@/services/mitt";
import type { FriendRequest } from "@/types/friendRequest.type";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRequestStatusStore } from "./request.status.store";
import { useToastStore } from "./toast.store";

export const useRequestStore = defineStore("request", () => {
  const REQUEST_ENPOINT = "/api/users/requests";

  const sent = ref<FriendRequest[]>([]);
  const received = ref<FriendRequest[]>([]);
  const state = reactive({ loading: false, error: false });
  const { reset: statusReset } = useRequestStatusStore();
  const { toast } = useToastStore();

  const individualState = reactive({
    id: 0,
    loading: false,
    error: false,
  });

  const sortByDate = (requests: FriendRequest[]) => {
    return requests.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const fetchSent = () => {
    state.loading = true;

    setTimeout(() => {
      http
        .get(`${REQUEST_ENPOINT}/sent`)
        .then((res) => {
          sent.value = sortByDate(res.data);
          statusReset();
        })
        .catch((e) => {
          state.error = true;
          console.log(e);
        })
        .finally(() => (state.loading = false));
    }, 500);
  };

  const fetchReceived = () => {
    state.loading = true;

    setTimeout(() => {
      http
        .get(`${REQUEST_ENPOINT}/received`)
        .then((res) => {
          received.value = sortByDate(res.data);
          statusReset();
        })
        .catch((e) => {
          state.error = true;
          console.log(e);
        })
        .finally(() => (state.loading = false));
    }, 500);
  };

  const alreadySent = (receiverId: number) => {
    return !!sent.value.find((request) => request.id.receiverId === receiverId);
  };

  const alreadyReceived = (requesterId: number) => {
    return !!received.value.find(
      (request) => request.id.requesterId === requesterId
    );
  };

  const addSent = (request: FriendRequest) => {
    sent.value.unshift(request);
  };

  const addReceived = (request: FriendRequest) => {
    received.value.unshift(request);
  };

  const removeSent = (receiverId: number) => {
    sent.value = sent.value.filter(
      (request) => request.receiver?.id !== receiverId
    );
  };

  const removeReceived = (requesterId: number) => {
    received.value = received.value.filter(
      (request) => request.requester?.id !== requesterId
    );
  };

  const sendRequest = (receiverId: number) => {
    individualState.id = receiverId;
    individualState.loading = true;

    setTimeout(() => {
      http
        .post(`${REQUEST_ENPOINT}/send`, { receiverId: receiverId })
        .then((res) => {
          addSent(res.data);

          emitter.emit("requestSent", "request-sent");

          toast("Request Sent", { variant: "success" });
        })
        .catch((e) => {
          console.log(e);
          individualState.error = true;
        })
        .finally(() => (individualState.loading = false));
    }, 500);
  };

  const reset = () => {
    state.error = false;
    state.loading = false;

    resetIndividualState();
    statusReset();

    received.value = [];
    sent.value = [];
  };

  const resetIndividualState = () => {
    individualState.id = 0;
    individualState.loading = false;
    individualState.error = false;
  };

  return {
    fetchReceived,
    fetchSent,
    sent,
    received,
    state,
    reset,
    resetIndividualState,
    addReceived,
    individualState,
    alreadySent,
    alreadyReceived,
    sendRequest,
    removeSent,
    removeReceived,
  };
});

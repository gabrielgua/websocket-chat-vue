import { defineStore } from "pinia";
import { useRequestStore } from "./request.store";
import { http } from "@/services/http";
import { reactive, ref } from "vue";
import { useToastStore } from "./toast.store";
import { useFriendStore } from "./friend.store";
import { useAsideStore } from "./aside.store";
import type { User } from "@/types/user.type";
import type { AxiosError } from "axios";

export const useRequestStatusStore = defineStore("requestStatus", () => {
  const REQUEST_ENPOINT = "/api/users/requests";

  const requestStore = useRequestStore();
  const friendStore = useFriendStore();
  const asideStore = useAsideStore();

  const { toast } = useToastStore();
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
        .put(`${REQUEST_ENPOINT}/accept`, { requesterId })
        .then((res) => handleRequestAcceptedSuccess(res.data))
        .catch((e) => handleErrorStatus(e))
        .finally(() => (state.loading = false));
    }, 500);
  };

  const handleRequestAcceptedSuccess = (user: User) => {
    requestStore.removeReceived(user.id);
    friendStore.addFriend(user);
    asideStore.addNotification("friends");
    toast("Request accepted", {
      description: `@${user.username} is now your friend.`,
      avatarUrl: user.avatarUrl,
    });
  };

  const cancelRequest = (receiverId: number) => {
    request(receiverId);

    setTimeout(() => {
      http
        .delete(`${REQUEST_ENPOINT}/cancel`, { data: { receiverId } })
        .then(() => {
          requestStore.removeSent(receiverId);
          state.success = true;

          toast("Request canceled", {
            variant: "success",
          });
        })
        .catch((e) => handleErrorStatus(e))
        .finally(() => (state.loading = false));
    }, 500);
  };

  const denyRequest = (requesterId: number) => {
    request(requesterId);

    setTimeout(() => {
      http
        .delete(`${REQUEST_ENPOINT}/deny`, { data: { requesterId } })
        .then(() => {
          requestStore.removeReceived(requesterId);
          state.success = true;

          toast("Request denied", {
            variant: "success",
          });
        })
        .catch((e) => handleErrorStatus(e))
        .finally(() => (state.loading = false));
    }, 500);
  };

  const handleErrorStatus = (e: AxiosError, description?: string) => {
    console.error(e);
    state.error = true;
    toast("Something occurred", {
      variant: "danger",
      description: description ? description : "Try refreshing the requests.",
    });
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

  return { state, acceptRequest, cancelRequest, denyRequest, reset };
});

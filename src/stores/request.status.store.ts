import { defineStore } from "pinia";
import { useRequestStore } from "./request.store";
import { http } from "@/services/http";
import { reactive, ref } from "vue";
import { useToastStore } from "./toast.store";
import { useFriendStore } from "./friend.store";
import { useAsideStore } from "./aside.store";
import type { User } from "@/types/user.type";

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
        .catch((e) => {
          console.log(e);
          state.error = true;
          toast("Something occurred!", "danger", e.response.data.message);
        })
        .finally(() => (state.loading = false));
    }, 500);
  };

  const handleRequestAcceptedSuccess = (user: User) => {
    requestStore.removeReceived(user.id);
    friendStore.addFriend(user);
    asideStore.addNotification("friends");
    toast(
      "Request accepted",
      "success",
      `${user.username} is now your friend.`
    );
  };

  const cancelRequest = (receiverId: number) => {
    request(receiverId);

    setTimeout(() => {
      http
        .delete(`${REQUEST_ENPOINT}/cancel`, { data: { receiverId } })
        .then(() => {
          requestStore.removeSent(receiverId);
          state.success = true;

          toast(
            "Request canceled",
            "info",
            "The request was successfully canceled."
          );
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

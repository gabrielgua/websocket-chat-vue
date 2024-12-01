import { emitter } from "@/services/mitt";
import { useAsideStore } from "@/stores/aside.store";
import { useChatStore } from "@/stores/chat.store";
import { useFriendStore } from "@/stores/friend.store";
import { useMessageStore } from "@/stores/message.store";
import { useRequestStore } from "@/stores/request.store";
import { useToastStore } from "@/stores/toast.store";
import type { FriendRequest } from "@/types/friendRequest.type";

export default class Handler {
  init() {
    emitter.on("requestNotification", handleRequestNotification);

    emitter.on("message", handleMessageReceived);
    emitter.on("connectionNotification", handleConnectionNotification);
    emitter.on("chatConnectionNotification", handleConnectionNotification);
  }
}

const chatStore = useChatStore();
const asideStore = useAsideStore();
const messageStore = useMessageStore();
const requestStore = useRequestStore();
const toastStore = useToastStore();
const friendStore = useFriendStore();

const handleRequestNotification = (body: string) => {
  const request: FriendRequest = JSON.parse(body);
  if (request.requester) {
    requestStore.addReceived(request);
    asideStore.addNotification("requests");

    toastStore.append(
      "Request received",
      "info",
      `${request.requester.username} has sent you a friend request.`
    );
  }

  if (request.receiver) {
    friendStore.fetchFriends();
    requestStore.removeSent(request.receiver.id);
    asideStore.addNotification("friends");

    toastStore.append(
      "Request accepted",
      "success",
      `${request.receiver.username} accepted your friend request. `
    );
  }
};

const handleMessageReceived = (body: string) => {
  const message = JSON.parse(body);

  console.log(message);

  if (message.chat === chatStore.current.id) {
    messageStore.add(message);
  }
};

const handleConnectionNotification = (body: string) => {
  chatStore.updateChatUserStatus(JSON.parse(body));
};

import { emitter } from "@/services/mitt";
import { useAsideStore } from "@/stores/aside.store";
import { useChatStore } from "@/stores/chat.store";
import { useMessageStore } from "@/stores/message.store";
import { useRequestStore } from "@/stores/request.store";
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

const handleRequestNotification = (body: string) => {
  const request: FriendRequest = JSON.parse(body);
  if (request.requester) {
    requestStore.addReceived(request);
    asideStore.addNotification("requests");
  }
};

const handleMessageReceived = (body: string) => {
  const message = JSON.parse(body);

  if (message.chat === chatStore.current.id) {
    messageStore.add(message);
  }
};

const handleConnectionNotification = (body: string) => {
  chatStore.updateChatUserStatus(JSON.parse(body));
};

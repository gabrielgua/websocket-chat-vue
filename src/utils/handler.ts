import { emitter } from "@/services/mitt";
import { useAsideStore } from "@/stores/aside.store";
import { useAudioStore } from "@/stores/audio.store";
import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";
import { useFriendStore } from "@/stores/friend.store";
import { useRequestStore } from "@/stores/request.store";
import { useToastStore } from "@/stores/toast.store";
import { useUnreadStore } from "@/stores/unread.store";
import type { FriendRequest } from "@/types/friendRequest.type";
import type { Message } from "@/types/message.type";

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
const requestStore = useRequestStore();
const { toast } = useToastStore();
const friendStore = useFriendStore();
const unreadStore = useUnreadStore();
const authStore = useAuthStore();

const handleRequestNotification = (body: string) => {
  const request: FriendRequest = JSON.parse(body);
  if (request.requester) {
    if (requestStore.alreadyReceived(request.requester.id)) {
      return;
    }

    requestStore.addReceived(request);
    asideStore.addNotification("requests");

    toast("Request received", {
      avatarUrl: request.requester.avatarUrl,
      description: `@${request.requester.username} wants to be friends.`,
    });
  }

  if (request.receiver) {
    friendStore.fetchFriends();
    requestStore.removeSent(request.receiver.id);
    asideStore.addNotification("friends");

    toast("Request accepted", {
      avatarUrl: request.receiver.avatarUrl,
      description: `@${request.receiver.username} is now your friend.`,
    });
  }
};

const handleMessageReceived = (body: string) => {
  const message: Message = JSON.parse(body);
  const chat = chatStore.findChat(message.chat);
  if (!chat) {
    return;
  }

  const noChatOpened = chatStore.currentIsEmpty();
  const isDifferentChat = chatStore.current.id !== chat.id;
  const isDifferentSender =
    authStore.authentication.userId !== message.sender.id;

  chatStore.updateLastMessage(message);
  chatStore.addMessage(message);

  console.log((noChatOpened || isDifferentChat) && isDifferentSender);

  if ((noChatOpened || isDifferentChat) && isDifferentSender) {
    unreadStore.add(message);
    asideStore.addNotification("chats");
  }

  chatStore.sortChatList();
};

const handleConnectionNotification = (body: string) => {
  chatStore.updateChatUserStatus(JSON.parse(body));
};

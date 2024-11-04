<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { useUnreadStore } from '@/stores/unread.store';
import { useUserStore } from '@/stores/user.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { onUnmounted } from 'vue';
import ChatIcon from './ChatIcon.vue';
import { formatTimestamp } from '@/utils/date';
import { useAuthStore } from '@/stores/auth.store';
import { format, formatDistance, isToday, isYesterday, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { User } from '@/types/user.type';

defineProps<{
  chats: Chat[]
}>();

onUnmounted(() => {
  userStore.reset();
  messageStore.reset();
})


const chatStore = useChatStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const messageStore = useMessageStore();
const unreadStore = useUnreadStore();

function isCurrent(chat: Chat): boolean {
  return chatStore.current.id === chat.id;
}

function isSender(message: Message) {
  return messageStore.isSender(message);
}

function changeCurrent(chat: Chat) {

  chatStore.changeCurrent(chat);

  if (chat.notifications > 0) {
    unreadStore.read(chat);
  }
}



emitter.on('message', handleOnMessage);
emitter.on('notification', chatStore.fetchChatStatusCount);

function handleOnMessage(body: string) {
  const message: Message = JSON.parse(body);

  chatStore.updateLastMessage(message);
  chatStore.sortChatList();

  if (chatStore.current.id != message.chat && !isSender(message)) {
    unreadStore.add(message);
  }
}

function isAuthenticatedUser(user: User) {
  return authStore.authentication.userId === user.id;
}

function displayUsername(user: User) {
  return isAuthenticatedUser(user) ? 'You' : user.username;
}

function hasLastMessage(chat: Chat): boolean {
  return Object.keys(chat.lastMessage).length > 0;
}

function displayFullTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), { addSuffix: true, locale: ptBR });
}


</script>

<template>
  <TransitionGroup name="chat-list" tag="ul" class="relative overflow-y-scroll">
    <button class="group w-full flex items-center p-3 gap-4 transition-all" v-for="chat in chats" :key="chat.id"
      @click="changeCurrent(chat)" :class="isCurrent(chat) ? 'bg-slate-800' : 'hover:bg-slate-800/50'">

      <ChatIcon :chat="chat" />


      <div class="flex flex-col truncate flex-grow items-start gap-1">
        <p class="font-bold">{{ chat.name }}</p>
        <p class="text-xs text-slate-400 truncate max-w-full" v-if="hasLastMessage(chat)">
          <span class="font-semibold" v-if="chat.type === ChatType.group">
            {{ displayUsername(chat.lastMessage.sender) }}:
          </span>
          {{ chat.lastMessage.content }}
        </p>
        <p v-else class="text-xs text-slate-400 truncate max-w-full">
          {{ displayUsername(chat.creator) }} created this chat.
        </p>
      </div>

      <div class="ms-auto text-sm text-slate-400 min-w-max h-full">
        <div class="flex flex-col h-full items-end">
          <p class="text-[11px] mb-auto" :class="{ 'text-sky-400': chat.notifications > 0 }"
            v-if="hasLastMessage(chat)">
            {{ formatTimestamp(chat.lastMessage.timestamp) }}
          </p>
          <p v-else class="text-[11px] mb-auto">{{ displayFullTimestamp(chat.createdAt) }}</p>
          <div class="text-right flex items-center gap-3 ">
            <Transition name="chat-notification">
              <p class="rounded-full grid place-items-center w-5 bg-sky-600 aspect-square text-white font-semibold"
                v-if="chat.notifications > 0">{{ chat.notifications }}</p>
            </Transition>
          </div>
        </div>
      </div>
    </button>
  </TransitionGroup>
</template>



<style scoped>
/* width */
::-webkit-scrollbar {
  width: .25rem;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(2 132 199);
  border-radius: .25rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: white;
}

.chat-list-move,
.chat-list-enter-active,
.chat-list-leave-active {
  transition: all 250ms ease;
}

.chat-list-enter-from,
.chat-list-leave-to {
  opacity: 0;
  scale: .95;
  /* position: absolute; */
  /* transform: translateX(30px); */

}

.chat-list-leave-active {
  /* transition: all 250ms ease; */
  position: absolute;
  /* width: max-content;; */
}

.chat-notification-enter-active,
.chat-notification-leave-active {
  transition:
    opacity 100ms ease,
    scale 100ms ease;
}

.chat-notification-enter-from,
.chat-notification-leave-to {
  scale: .8;
  opacity: 0;
}
</style>

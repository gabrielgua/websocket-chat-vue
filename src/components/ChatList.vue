<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { useUnreadStore } from '@/stores/unread.store';
import { useUserStore } from '@/stores/user.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import type { User } from '@/types/user.type';
import { format, isSameWeek, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { onUnmounted } from 'vue';
import ChatIcon from './ChatIcon.vue';

defineProps<{
  chats: Chat[]
}>();

onUnmounted(() => {
  userStore.reset();
  messageStore.reset();
})


const chatStore = useChatStore();
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

function formatTimestamp(timestamp: Date) {
  let date = "PP"
  if (isToday(timestamp)) date = "HH:mm";
  else if (isYesterday(timestamp)) date = "'Ontem'";
  else if (isSameWeek(timestamp, new Date())) date = "EEEE' às 'HH:mm";

  return format(timestamp, date, { locale: ptBR });
}

emitter.on('message', handleOnMessage);
emitter.on('notification', chatStore.fetchChatStatusCount);

function handleOnMessage(body: string) {
  const message: Message = JSON.parse(body);

  chatStore.updateLastMessage(message);
  chatStore.sortChatsByLastMessage();

  if (chatStore.current.id != message.chat && !isSender(message)) {
    unreadStore.add(message);
  }
}

function hasLastMessage(chat: Chat): boolean {

  return Object.keys(chat.lastMessage).length > 0;
}

function getAvatarName(chat: Chat) {
  if (chat.type === ChatType.private && chat.receiver) {
    return chat.receiver?.name;
  }

  return chat.name;
}

function getUserColor(user: User) {
  return userStore.getUserColor(user);
}

</script>

<template>
  <TransitionGroup name="chat-list">
    <button class="group w-full overflow-x-hidden flex items-center p-3 gap-4 hover:bg-slate-800 transition-all"
      v-for="chat in chats" :key="chat.id" @click="changeCurrent(chat)" :class="{ 'bg-slate-800': isCurrent(chat) }">

      <ChatIcon :is-current="isCurrent(chat)" :name="getAvatarName(chat)"
        :class="[chat.type === ChatType.private ? getUserColor(chat.receiver!) : 'text-white']" />

      <div class="flex flex-col truncate flex-grow items-start gap-1">
        <p class="font-bold">{{ chat.name }}</p>
        <p class="text-xs text-slate-400 truncate max-w-full" v-if="hasLastMessage(chat)">
          <span class="font-semibold" v-if="chat.type === ChatType.group">
            {{ isSender(chat.lastMessage) ? 'You' : chat.lastMessage.sender.username }}:
          </span>
          {{ chat.lastMessage.content }}
        </p>
      </div>

      <div class="ms-auto text-sm text-slate-400 min-w-max h-full">
        <div class="flex flex-col h-full items-end">
          <p class="text-[11px] mb-auto" :class="{ 'text-sky-400': chat.notifications > 0 }"
            v-if="hasLastMessage(chat)">
            {{ formatTimestamp(chat.lastMessage.timestamp) }}</p>
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
.chat-list-enter-active,
.chat-list-leave-active {
  transition: all 0.25s ease;
}

.chat-list-enter-from,
.chat-list-leave-to {
  opacity: 0;
  scale: .9;
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

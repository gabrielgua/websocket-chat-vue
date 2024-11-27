<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { useStompStore } from '@/stores/stomp.store';
import { useUserStore } from '@/stores/user.store';
import { ChatType } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import type { User } from '@/types/user.type';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import Button from '../Button.vue';
import Spinner from '../Spinner.vue';
import ChatIcon from './ChatIcon.vue';

const message = ref('');
const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const messageStore = useMessageStore();

const current = computed(() => chatStore.current);
const chatbox = ref({} as HTMLElement);

function handleMessageReceived(body: string) {
  const message: Message = JSON.parse(body);

  if (message.chat === current.value.id) {
    messageStore.add(message);
  }
}

onMounted(() => {
  watch(current, (newChat) => {
    messageStore.fetchMessages(newChat.id)
      .then(() => scrollToBottom('instant'));

  });

  emitter.on('message', handleMessageReceived);
  emitter.on('notification', chatStore.fetchChatStatusCount)
})

onUnmounted(() => {
  chatStore.reset();
})

//this will trigger whenever a new message is added
onUpdated(() => scrollToBottom('smooth'));

function scrollToBottom(behavior: ScrollBehavior) {
  chatbox.value.scrollTo({ top: chatbox.value.scrollHeight, behavior: behavior });
}

function sendMessage() {
  chatStore.sendMessage({ chatId: current.value.id, content: message.value.trim() });
  message.value = '';
}

function formatTimestamp(timestamp: Date) {
  return format(timestamp, "HH:mm");
}

function isSameSender(senderId: number, index: number) {
  if (index === 0) {
    return false;
  }
  return messageStore.messages[index - 1].sender.id === senderId;
}

function isMessageSender(userId: number) {
  return userId === authStore.authentication.userId;
}

function isGroupChat() {
  return current.value.type === ChatType.group;
}

function showChat() {
  return !chatStore.currentIsEmpty();
}

function sameDay(current: Message, index: number) {
  if (index === 0) {
    return false;
  }
  const previous = messageStore.messages[index - 1];
  return isSameDay(previous.timestamp, current.timestamp);
}

function displayFullTimestamp(timestamp: Date) {
  let date = "PPPP";
  if (isToday(timestamp)) date = "'Hoje, 'P";
  else if (isYesterday(timestamp)) date = "'Ontem, 'P";

  return format(timestamp, date, { locale: ptBR });
}

function showMessageHeader(message: Message, index: number) {
  const sameSenderDifferentDay = isSameSender(message.sender.id, index) && !sameDay(message, index);

  return isGroupChat() && (!isSameSender(message.sender.id, index) || sameSenderDifferentDay);
}

function getUserColor(sender: User) {
  return userStore.getUserColor(sender);
}

function isLoading() {
  return messageStore.state.loading;
}


</script>

<template>
  <span class="m-4 ml-0 bg-slate-800 rounded-xl grid place-items-center" v-if="!showChat()">
    Welcome, star chatting now!
  </span>
  <div class=" bg-slate-800 m-4 ms-0 rounded-xl overflow-hidden flex flex-col" v-else>
    <div class="flex items-center gap-4 p-4 bg-slate-800 rounded-lg shadow-2xl">

      <ChatIcon :chat="current" status />

      <div class="flex flex-col transition-all">

        <p class="font-bold">{{ current.name }}</p>
        <div v-if="chatStore.isGroupChat(current)">
          <div class="flex items-center text-xs text-slate-400">
            <p>{{ current.statusCount.members }} members - </p>
            <span class="w-2 flex aspect-square rounded-full mx-1 bg-green-600"></span>
            <p>{{ current.statusCount.online }} online</p>
          </div>
        </div>
        <Transition name="online">
          <div v-if="chatStore.isReceiverOnline(current)">
            <p class="text-xs text-slate-400">online</p>
          </div>
        </Transition>
      </div>

      <Button class="ms-auto" icon="fa-gear" variant="secondary-text" tooltip="Settings" tooltip-pos="left" rounded />
    </div>



    <div class="p-4 max-h-full overflow-y-scroll chatbox" ref="chatbox">

      <div class="flex flex-col items-center gap-5 py-10" v-if="isLoading()">
        <Spinner />
        <p class="text-sm text-slate-400">Loading messages</p>
      </div>

      <div class="gap-3 text-[13px] items-center border border-slate-400/20 p-2 rounded-full">
        <span class="flex items-center justify-center gap-2 text-slate-500">
          <img :src="current.creator.avatarUrl" alt="creator avatar pic" class="size-6 block">
          <p>
            <span class="font-semibold" :class="getUserColor(current.creator)">{{ isMessageSender(current.creator.id) ?
              'You' : current.creator.username }}</span>
            created this chat at {{ displayFullTimestamp(current.createdAt) }}
          </p>
        </span>
      </div>

      <div v-if="!isLoading()" class="group mt-4 flex flex-col" v-for="(message, i) in messageStore.messages"
        :key="message.id" :class="{ 'mt-[.125rem]': isSameSender(message.sender.id, i) }">

        <span class="relative mt-4 mb-5 flex items-center justify-center text-sm w-full" v-if="!sameDay(message, i)">
          <p class="z-10 bg-slate-900/40 px-2 py-1 text-slate-400 font-light text-xs   rounded">
            {{ displayFullTimestamp(message.timestamp) }}
          </p>
        </span>

        <section class="grid"
          :class="{ 'grid-columns': !isMessageSender(message.sender.id) && chatStore.current.type === ChatType.group }">
          <div v-if="!isMessageSender(message.sender.id)">
            <div v-if="showMessageHeader(message, i)" class="grid place-items-center w-8 h-8 rounded-full">
              <img :src="message.sender.avatarUrl">
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2" :class="{ 'flex-row-reverse': isMessageSender(message.sender.id) }">
              <div class="relative flex flex-col rounded-xl md:max-w-[75%] sm:max-w-full"
                :class="[isMessageSender(message.sender.id) ? 'bg-sky-600' : 'bg-slate-900']">
                <div class="text-xs font-bold mb-1 col-span-2 px-2.5 mt-2"
                  v-if="showMessageHeader(message, i) && !isMessageSender(message.sender.id)">
                  <p :class="getUserColor(message.sender)">{{ message.sender.username }}</p>
                </div>
                <div class="flex justify-between gap-2">
                  <p class="py-1.5 px-2.5 text-sm font-normal"
                    :class="{ 'pt-0.5': showMessageHeader(message, i) && !isMessageSender(message.sender.id) }">
                    {{ message.content }}
                  </p>
                  <span class="mb-0.5 mr-1.5 text-xs font-medium self-end"
                    :class="[isMessageSender(message.sender.id) ? 'text-sky-400' : 'text-slate-600']">
                    {{ formatTimestamp(message.timestamp) }}
                  </span>
                </div>
                <span class="absolute top-0 message-first-triangle"
                  :class="[isMessageSender(message.sender.id) ? '-right-2 left-auto bg-sky-600' : '-left-2 bg-slate-900']"
                  :style="{ 'display': isSameSender(message.sender.id, i) && sameDay(message, i) ? 'none' : 'block' }">
                </span>
              </div>
              <span class="group-hover:block hidden text-xs text-gray-500">
                {{ format(message.timestamp, "P", { locale: ptBR }) }}
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>

    <form class="mt-auto p-4 flex items-center justify-between gap-4" @submit.prevent="sendMessage">
      <div
        class="flex items-center transition-all text-sm outline-none focus-within:ring-2 focus-within:ring-sky-600 bg-slate-900 w-full rounded-2xl p-2 ps-2">
        <input class="p-2 bg-transparent focus:outline-none w-full" required v-model="message" type="text"
          placeholder="Type messages here" />
        <Button class="ms-auto" icon="fa-paper-plane" variant="primary-text" tooltip="Send" tooltip-pos="top" rounded
          submit />
      </div>
    </form>
  </div>
</template>

<style scoped>
.message-first-triangle {
  --r: 1px;
  /*  border radius */

  --mask: conic-gradient(from 157.5deg at 50% calc(var(--r)/(3*sqrt(2) - 4) - 100%/tan(22.5deg)), #000 45deg, #0000 0) 0 0/100% calc(100% - var(--r)/sqrt(2)) no-repeat,
    radial-gradient(var(--r) at 50% calc(100% - var(--r)*sqrt(2)), #000 98%, #0000 101%),
    radial-gradient(var(--r) at left var(--_g)),
    radial-gradient(var(--r) at right var(--_g));

  height: 10px;
  aspect-ratio: 2;
  --_g: calc(var(--r)/tan(22.5deg)) top var(--r), #000 98%, #0000 101%;
  -webkit-mask: var(--mask);
  mask: var(--mask);

  clip-path: polygon(50% 100%, 100% 0, 0 0);
}

.chatbox:hover ::-webkit-scrollbar-thumb {
  display: block;
}

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

.online-enter-active {
  transition: all 250ms ease;
}

.online-leave-active {
  transition: all 0ms;
}

.online-enter-from,
.online-leave-to {
  opacity: 0;
  scale: .8;
}

.grid-columns {
  grid-template-columns: 2.75rem 1fr;
}
</style>

<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { useStompStore } from '@/stores/stomp.store';
import { useUserStore } from '@/stores/user.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import type { User } from '@/types/user.type';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';

const message = ref('');
const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const stompStore = useStompStore();
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
  const messageRequest = {
    senderId: authStore.authentication.userId,
    chatId: current.value.id,
    content: message.value.trim(),
  };

  stompStore.send(`/app/chats/${messageRequest.chatId}.sendMessage`, messageRequest);
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

function isMessageSender(senderId: number) {
  return senderId === authStore.authentication.userId;
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

function displaySender(username: string) {
  return username === authStore.authentication.username ? '' : username;
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

function getSenderColor(sender: User) {
  return userStore.getUserColor(sender);
}

function getAvatarName(sender: User) {
  return userStore.generateNameAbreviation(sender);
}

</script>

<template>
  <span class="m-4 grid place-items-center" v-if="!showChat()">Welcome, star chatting now!</span>
  <div class=" bg-slate-800 m-4 ms-0 rounded-xl overflow-hidden flex flex-col" v-else>
    <div class="flex items-center gap-4 p-4 bg-slate-800 rounded-lg shadow-2xl">
      <div
        class="relative bg-slate-900 ring-slate-500 ring-opacity-20 w-12 grid place-items-center rounded-full aspect-square">
        <fa-icon icon="fa-solid fa-users" class="block" v-if="isGroupChat()" />
        <fa-icon icon="fa-solid fa-user" class="block" v-else />

        <div class="absolute top-1 right-1 grid place-items-center" v-if="!isGroupChat()">
          <span :class="[chatStore.isReceiverOnline(current) ? 'bg-emerald-500' : 'bg-slate-600']"
            class="rounded-full w-2 aspect-square outline outline-4 outline-slate-800"></span>
        </div>
      </div>
      <div class="transition-all">
        <p class="font-bold">{{ current.name }}</p>
        <div class="text-xs text-slate-400">
          <div v-if="chatStore.isGroupChat(current)" class="flex items-center">
            <p>{{ current.statusCount.members }} members - </p>
            <span class="w-2 flex aspect-square rounded-full mx-1 bg-green-600"></span>
            <p>{{ current.statusCount.online }} online</p>
          </div>
          <div v-else>
            <Transition name="online">
              <p v-if="chatStore.isReceiverOnline(current)">online</p>
            </Transition>
          </div>
        </div>
      </div>
      <div class="ms-auto me-2 flex items-center gap-4">
        <button
          class="aspect-square w-11 grid place-items-center hover:bg-slate-700 hover:text-sky-600 transition-all rounded-full  text-slate-500">
          <fa-icon icon="fa-solid fa-chevron-down" />
        </button>
      </div>
    </div>

    <div class="p-4 max-h-full overflow-y-scroll chatbox" ref="chatbox">
      <div v-if="!messageStore.messages.length" class="flex gap-3 text-sm text-slate-500 items-center">
        <fa-icon icon="fa-solid fa-comment" />
        <span>
          Send your first message here :)
        </span>
      </div>

      <div class="group mt-4 flex flex-col" v-for="(message, i) in messageStore.messages" :key="message.id"
        :class="{ 'mt-[.125rem]': isSameSender(message.sender.id, i) }">

        <span class="relative mt-4 mb-5 flex items-center justify-center text-sm w-full" v-if="!sameDay(message, i)">
          <p class="z-10 bg-slate-900/40 px-2 py-1 text-slate-400 font-light text-xs   rounded">
            {{ displayFullTimestamp(message.timestamp) }}
          </p>
          <!-- <span class="w-full border-b absolute border-slate-700 border-opacity-50"></span> -->
        </span>

        <section class="grid"
          :class="{ 'grid-columns': !isMessageSender(message.sender.id) && chatStore.current.type === ChatType.group }">
          <div v-if="!isMessageSender(message.sender.id)">
            <div v-if="showMessageHeader(message, i)"
              class="mt-[1.125rem] grid place-items-center w-8 h-8 rounded-full bg-slate-900/60">

              <p class="text-[12px] font-bold" :class="getSenderColor(message.sender)">
                {{ getAvatarName(message.sender) }}
              </p>
            </div>
          </div>

          <div>
            <div class="text-xs font-bold mb-1" v-if="showMessageHeader(message, i)">
              <p :class="getSenderColor(message.sender)">{{ displaySender(message.sender.username) }}</p>
            </div>
            <div class="flex items-center gap-2" :class="{ 'flex-row-reverse': isMessageSender(message.sender.id) }">
              <div class="relative flex items-center justify-between gap-2 rounded-xl max-w-[75%]"
                :class="[isMessageSender(message.sender.id) ? 'bg-sky-600' : 'bg-slate-900']">
                <p class="pl-2.5 py-1.5 text-sm"
                  :class="[isMessageSender(message.sender.id) ? 'font-medium' : 'font-normal']">
                  {{ message.content }}
                </p>
                <span class="mb-0.5 mr-1.5 text-xs font-medium self-end"
                  :class="[isMessageSender(message.sender.id) ? 'text-sky-400' : 'text-slate-600']">
                  {{ formatTimestamp(message.timestamp) }}
                </span>
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
      <input
        class="transition-all text-sm outline-none focus:ring-2 focus:ring-sky-600 bg-slate-900 p-3 ps-4 w-full rounded-lg"
        required v-model="message" type="text" placeholder="Type messages here" />
      <button
        class="hover:-translate-y-1 hover:shadow-lg transition-all grid place-items-center w-11 rounded-full aspect-square bg-sky-600"
        type="submit">
        <fa-icon icon="fa-solid fa-paper-plane" />
      </button>
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

.online-enter-active,
.online-leave-active {
  transition: opacity 0.5s ease;
}

.online-enter-from,
.online-leave-to {
  opacity: 0;
}

.grid-columns {
  grid-template-columns: 2.75rem 1fr;
}
</style>

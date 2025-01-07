<script setup lang="ts">
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { ChatType } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { computed, nextTick, ref, watch } from 'vue';
import Button from '../Button.vue';
import MessageComponent from '../Messages/Message.vue';
import Spinner from '../Spinner.vue';
import FadeTransition from '../Transitions/FadeTransition.vue';
import ChatHeader from './ChatHeader.vue';

const message = ref('');
const chatStore = useChatStore();


const messageStore = useMessageStore();
const current = computed(() => chatStore.current);

const chatbox = ref<HTMLDivElement | null>(null);

//when changing the current chat
watch(() => current.value, () => {
  if (!current.value) { return; }

  messageStore.fetchMessagesForChat(current.value.id);
  if (!messageStore.state.loading) {
    scrollToBottom('instant');

  }
});

//when adding a new message 
watch(() => messageStore.messages, (newMessages, oldMessages) => {
  if (!newMessages.length || !oldMessages.length) {
    return;
  }

  if (newMessages[newMessages.length - 1].chat === oldMessages[oldMessages.length - 1].chat) {
    scrollToBottom('smooth');
    return;
  }

  scrollToBottom('instant');

}, { deep: true })


function scrollToBottom(behavior: ScrollBehavior) {
  nextTick(() => {
    if (chatbox.value) {
      chatbox.value.scrollTo({ top: chatbox.value!.scrollHeight, behavior })
    }
  })
}

function sendMessage() {
  if (!current.value) {
    return;
  }

  chatStore.sendMessage({ chatId: current.value.id, content: message.value.trim() });
  message.value = '';
}



function isSameSender(senderId: number, index: number) {
  if (index === 0) {
    return false;
  }
  return messageStore.messages[index - 1].sender.id === senderId;
}


function isGroupChat() {
  return current.value?.type === ChatType.group;
}



function sameDay(message: Message, index: number) {
  if (index === 0) {
    return false;
  }
  const previous = messageStore.messages[index - 1];
  return isSameDay(previous.timestamp, message.timestamp);
}

function displayFullTimestamp(timestamp: Date) {
  let date = "PPPP";
  if (isToday(timestamp)) date = "'Hoje";
  else if (isYesterday(timestamp)) date = "'Ontem";

  return format(timestamp, date, { locale: ptBR });
}

function showAvatar(message: Message, index: number) {
  const sameSenderDifferentDay = isSameSender(message.sender.id, index) && !sameDay(message, index);
  return !isSameSender(message.sender.id, index) || sameSenderDifferentDay;
}



</script>
<template>
  <FadeTransition>
    <div class="m-4 ml-0 bg-slate-800 gap-4 rounded-xl flex flex-col justify-center text-center"
      v-if="current === undefined">
      <fa-icon icon="fa-comments" class="text-slate-900 text-8xl" />
    </div>
    <div class="bg-slate-800 m-4 ms-0 rounded-xl flex flex-col" v-else>

      <ChatHeader :chat="current" />

      <div class="p-4 max-h-full flex-grow overflow-y-scroll chatbox" ref="chatbox">

        <div class="flex flex-col items-center gap-5 py-10" v-if="false">
          <Spinner />
          <p class="text-sm text-slate-400">Loading messages</p>
        </div>

        <ul>
          <li v-for="(message, i) in messageStore.messages" :key="i">
            <span class="mt-8 flex items-center justify-center gap-2 text-slate-400" v-if="!sameDay(message, i)">
              <!-- <fa-icon class="text-xs" icon="fa-calendar-days"></fa-icon> -->
              <p class="text-xs">{{ displayFullTimestamp(message.timestamp) }}</p>
            </span>

            <MessageComponent :avatar-url="message.sender.avatarUrl" :sender="message.sender"
              :timestamp="new Date(message.timestamp)" :show-sender-username="isGroupChat()"
              :show-avatar="showAvatar(message, i)">
              {{ message.content }}
            </MessageComponent>

          </li>
        </ul>

      </div>

      <form class="p-4 flex items-center justify-between gap-4" @submit.prevent="sendMessage">
        <div
          class="flex items-center transition-all text-sm outline-none focus-within:ring-2 focus-within:ring-sky-600 bg-slate-900 w-full rounded-2xl p-2 ps-2">
          <input class="p-2 bg-transparent focus:outline-none w-full" required v-model="message" type="text"
            placeholder="Type messages here" />
          <Button class="ms-auto" icon="fa-paper-plane" variant="primary-text" tooltip="Send" tooltip-pos="top" rounded
            submit />
        </div>
      </form>


    </div>
  </FadeTransition>
</template>

<style scoped>
::-webkit-scrollbar-thumb {
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
  background: rgba(2, 132, 199, .15);
  border-radius: .25rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: white;
}



.grid-columns {
  grid-template-columns: 2.75rem 1fr;
}
</style>

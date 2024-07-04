<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { useStompStore } from '@/stores/stomp.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { UserStatus, type User } from '@/types/user.type';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { computed, onMounted, onUpdated, ref, watch } from 'vue';

const props = defineProps<{
    chat: Chat,
}>();

const message = ref('');
const authStore = useAuthStore();
const chatStore = useChatStore();
const stompStore = useStompStore();
const messageStore = useMessageStore();

const currentChat = computed(() => props.chat);
const chatbox = ref({} as HTMLElement);

function handleMessageReceived(body: string) {
    const message: Message = JSON.parse(body);

    if (message.chat === currentChat.value.id) {
        messageStore.add(message);
    }
}

onMounted(() => {
    watch(currentChat, (newChat) => {
        messageStore.fetchMessages(newChat.id)
            .then(() => scrollToBottom('instant'));

    });

    emitter.on('message', handleMessageReceived);
})

//this will trigger whenever a new message is added to the DOM
onUpdated(() => scrollToBottom('smooth'));

function scrollToBottom(behavior: ScrollBehavior) {
    chatbox.value.scrollTo({ top: chatbox.value.scrollHeight, behavior: behavior });
}

function sendMessage() {
    const chatMessage = {
        senderId: authStore.authentication.userId,
        chatId: currentChat.value.id,
        content: message.value.trim(),
    };

    stompStore.send(`/app/chats/${currentChat.value.id}.sendMessage`, chatMessage);
    message.value = '';

}

function formatTimestamp(timestamp: Date) {
    return format(timestamp, "HH:mm");
}

function isSameSender(sender: string, index: number) {
    if (index === 0) {
        return false;
    }
    return messageStore.messages[index - 1].sender === sender;
}

function isMessageSender(sender: string) {
    return sender === authStore.authentication.username;
}

function isGroupChat() {
    return currentChat.value.type === ChatType.Group;
}

function showChat() {
    return currentChat.value.id != '0';
}

function sameDay(current: Message, index: number) {
    if (index === 0) {
        return false;
    }

    const previous = messageStore.messages[index - 1];

    return isSameDay(previous.timestamp, current.timestamp);
}

function displaySender(sender: string) {
    return sender === authStore.authentication.username ? 'You' : sender;
}

function displayFullTimestamp(timestamp: Date) {
    let date = "PPPP";
    if (isToday(timestamp)) date = "'Hoje, 'P";
    else if (isYesterday(timestamp)) date = "'Ontem, 'P";

    return format(timestamp, date, { locale: ptBR });
}

function showMessageHeader(message: Message, index: number) {
    const sameSenderDifferentDay = isSameSender(message.sender, index) && !sameDay(message, index);

    return isGroupChat() && (!isSameSender(message.sender, index) || sameSenderDifferentDay);
}


</script>

<template>
    <span class="bg-slate-800 m-4 ms-0 rounded-xl overflow-hidden grid place-items-center" v-if="!showChat()">Welcome, star chatting now!</span>
    <div class="bg-slate-800 m-4 ms-0 rounded-xl overflow-hidden flex flex-col" v-else>
        <div class="flex items-center gap-4 p-4 bg-slate-800 rounded-lg shadow-2xl">
            <div class="relative bg-slate-900 ring-slate-500 ring-opacity-20 w-12 grid place-items-center rounded-full aspect-square">
                <fa-icon icon="fa-solid fa-users" class="block" v-if="isGroupChat()" />
                <fa-icon icon="fa-solid fa-user" class="block" v-else />

                <div class="absolute top-1 right-1 grid place-items-center" v-if="!isGroupChat()">
                    <span 
                    :class="[chatStore.isReceiverOnline(chat) ? 'bg-emerald-500' : 'bg-slate-600']"
                    class="rounded-full w-2 aspect-square outline outline-4 outline-slate-800"></span>
                </div>
            </div>
            <div class="transition-all">
                <p class="font-bold">{{ currentChat.name }}</p>
                <div class="text-xs text-slate-400">
                    <div v-if="chatStore.isGroupChat(chat)" class="flex items-center">
                        <p class="">{{ currentChat.statusCount.members }} members - </p>
                        <span class="w-2 flex aspect-square rounded-full mx-1 bg-green-600"></span>
                        <p>{{ currentChat.statusCount.online }} online</p>
                    </div>
                        <div v-else>
                            <Transition name="online">
                                <p v-if="chatStore.isReceiverOnline(chat)">online</p>
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
            <div class="group mt-4 flex flex-col" v-for="(message, i) in messageStore.messages" :key="message.id"
                :class="{
                    'items-end': isMessageSender(message.sender),
                    'mt-[.125rem]': isSameSender(message.sender, i)
                }">

                <span class="relative mt-4 mb-5 flex items-center justify-center text-sm w-full"
                    v-if="!sameDay(message, i)">
                    <p class="z-10 bg-slate-800 px-4 text-slate-300 font-light text-xs">{{
                        displayFullTimestamp(message.timestamp) }}</p>
                    <span class="w-full border-b absolute border-slate-700 border-opacity-50"></span>
                </span>
                <div class="text-xs font-bold mb-1" v-if="showMessageHeader(message, i)">{{
                    displaySender(message.sender) }}</div>
                <div class="flex items-center gap-2" :class="{
                    'flex-row-reverse': isMessageSender(message.sender)
                }">
                    <div class="relative flex items-center justify-between gap-2 rounded-xl"
                        :class="[isMessageSender(message.sender) ? 'bg-sky-600' : 'bg-slate-900']">
                        <p class="pl-2.5 py-1.5 text-sm" 
                            :class="[isMessageSender(message.sender) ? 'font-medium' : 'font-normal']"
                        >{{ message.content }}</p>
                        <span class="mb-0.5 mr-1.5 text-xs font-medium self-end"
                            :class="[isMessageSender(message.sender) ? 'text-sky-400' : 'text-slate-600']">
                            {{ formatTimestamp(message.timestamp) }}
                        </span>
                        <span class="absolute top-0 message-first-triangle"
                            :class="[isMessageSender(message.sender) ? '-right-2 left-auto bg-sky-600' : '-left-2 bg-slate-900']"
                            :style="{ 'display': isSameSender(message.sender, i) && sameDay(message, i) ? 'none' : 'block' }">
                        </span>
                    </div>
                    <span class="group-hover:block hidden text-xs text-gray-500">{{ format(message.timestamp, "P",{locale: ptBR}) }}</span>
                </div>
            </div>


        </div>

        <form class="p-4 flex items-center justify-between gap-4" @submit.prevent="sendMessage">
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


</style>

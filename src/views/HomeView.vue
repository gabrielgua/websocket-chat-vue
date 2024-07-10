<script setup lang="ts">
import ChatComponent from '@/components/Chat.vue';
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useStompStore } from '@/stores/stomp.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { log } from 'console';
import { format, formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { onMounted, reactive, ref } from 'vue';


    const chatStore = useChatStore();
    const authStore = useAuthStore();
    const stompStore = useStompStore();
    const notificationStore = useNotificationStore();

    const currentChat = ref({
        id: '0'
    } as Chat);
    const state = reactive({loading: false, error: false});

    function openChat(chat: Chat) {
        currentChat.value = chat;
        notificationStore.read(chat.id);
    }

    onMounted(() => {
        
        authStore.checkAuthentication();
                
        stompStore.connect();
        emitter.on('message', handleOnMessage);
        emitter.on('connected', () => {
            stompStore.send('/app/user.connectUser', {id: authStore.authentication.userId});
        });
        emitter.on('disconnected', () => {
            stompStore.send('/app/user.disconnectUser', {id: authStore.authentication.userId})
        });

        emitter.on('statusNotification', chatStore.fetchChatStatusCount );
    })

    function handleOnMessage(body: string) {
        const message: Message = JSON.parse(body);

        chatStore.updateLastMessage(message);

        if (currentChat.value.id != message.chat) {
            notificationStore.notify(message.chat);
        }

        chatStore.sortChatsByLastMessage();
    }

    window.addEventListener('beforeunload', () => {
        stompStore.send('/app/user.disconnectUser', {id: authStore.authentication.userId})
    })

    function logout() {
        authStore.logout();
    }

    function isMessageSender(message: Message) {
        return authStore.authentication.username === message.sender;
    }

</script>

<template>
    <div class="antialiased grid grid-cols-3 grid-flow-row-dense content-start bg-slate-900 mx-auto container-width text-white">
        <header class="col-span-3 p-4 flex items-center gap-4">
            <h1 class="font-bold text-3xl">WebSocket Chat</h1>
            <fa-icon class="text-2xl" icon="fa-solid fa-comments" />

            <div class="ms-auto flex items-center gap-4">
                <p class="text-sm">{{ authStore.authentication.username }}</p>
                <button @click="logout" class="hover:*:text-rose-400 ">
                    <fa-icon class="text-slate-500 block transition-all" icon="fa-solid fa-right-from-bracket"/>
                </button>
            </div>
        </header>

        <div class="flex flex-col w-full">
            <div class="p-4 pb-0 flex flex-col gap-2">
                    
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold">Chats</h3>
                    <button class="rounded-full bg-sky-600 hover:bg-sky-700 grid place-items-center w-9 aspect-square">
                        <fa-icon icon="fa-solid fa-add"/>
                    </button>
                </div>
                <div class="bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
                    <fa-icon icon="fa-solid fa-magnifying-glass"/>
                    <input class="bg-transparent p-3 w-full outline-none text-white font-light text-sm" placeholder="Search chats" type="text" >
                </div>

                <div class="grid grid-cols-3 mt-2 gap-4">
                    <button class="flex items-center gap-2 justify-center bg-slate-800 py-1 rounded-xl hover:bg-slate-700 transition-all">
                        <fa-icon icon="fa-solid fa-comment" class="text-sm text-slate-500"></fa-icon>
                        <p class="text-sm">All</p>
                    </button>
                    <button class="flex items-center gap-2 justify-center bg-slate-800 py-1 rounded-xl hover:bg-slate-700 transition-all">
                        <fa-icon icon="fa-solid fa-user" class="text-sm text-slate-500"></fa-icon>
                        <p class="text-sm">Private</p>
                    </button>
                    <button class="flex items-center gap-2 justify-center bg-slate-800 py-1 rounded-xl hover:bg-slate-700 transition-all">
                        <fa-icon icon="fa-solid fa-users" class="text-sm text-slate-500"></fa-icon>
                        <p class="text-sm">Group</p>
                    </button>
                </div>

                <div class="border-b border-slate-800 mt-4"></div>

            </div>
            <div class="loading" v-if="state.loading">Loading...</div>

            <div class="flex flex-col pt-6" v-else>
                <button class="group w-full overflow-x-hidden flex items-center p-3 gap-4 hover:bg-slate-800 transition-all" v-for="chat in chatStore.chats"  @click="openChat(chat)" :class="{'bg-slate-800': chat.id === currentChat.id}">
                    
                    <div class="relative w-12 min-w-12 grid place-items-center rounded-full aspect-square group-hover:bg-slate-900"
                        :class="[chat.id === currentChat.id ? 'bg-slate-900' : 'bg-slate-800']"
                    >
                        <fa-icon icon="fa-solid fa-users" class="block" v-if="chatStore.isGroupChat(chat)"/>
                        <fa-icon icon="fa-solid fa-user" class="block" v-else/>

                        <div class="absolute top-1 right-1 grid place-items-center" v-if="!chatStore.isGroupChat(chat)">
                            <span 
                            :class="[chatStore.isReceiverOnline(chat) ? 'bg-emerald-500' : 'bg-slate-600',
                                chat.id === currentChat.id ? 'outline-slate-800' : 'outline-slate-900'
                             ]"
                            class="rounded-full w-2 aspect-square outline outline-4 group-hover:outline-slate-800"></span>
                        </div>
                    </div>
                 
                    <div class="flex flex-col truncate flex-grow items-start gap-1">
                        <p class="font-bold">{{ chat.name }}</p>
                        <p class="text-xs text-slate-400 truncate max-w-full">
                            <span class="font-semibold" v-if="chat.type === ChatType.Group">{{ isMessageSender(chat.lastMessage) ? 'You' : chat.lastMessage.sender }}: </span>
                            {{ chat.lastMessage.content }}
                        </p>
                    </div>
                    

                    <div class="ms-auto text-sm text-slate-400 min-w-max h-full">
                        <div class="flex flex-col h-full items-end">
                            <p class="text-[11px] mb-auto">{{ formatRelative(chat.lastMessage.timestamp, new Date(), {locale: ptBR}) }}</p>
                            <div class="text-right flex items-center gap-3 ">
                                <Transition name="chat-notification">
                                    <p class="rounded-full grid place-items-center w-5 bg-sky-600 aspect-square text-white font-semibold" v-if="chat.notifications > 0">{{ chat.notifications }}</p>
                                </Transition>
                            </div> 
                        </div>
                    </div>
                </button>

            </div> 
        </div>

        <ChatComponent class="col-span-2" :chat="currentChat" />
    </div>
</template> 

<style scoped>
    .container-width {
        --container-width: 1500px;
        --container-margin: 1rem;
        --container-height: calc(100dvh - var(--container-margin) * 2);

        margin-block: var(--container-margin);

        width: min(var(--container-width), 100%);
        height: var(--container-height);
    }

    @media  (max-width: 1500px) {
        .container-width {
            --container-margin: 0;
            --container-height: 100dvh;
        }
    }

    .chat-notification-enter-active,
    .chat-notification-leave-active {
        transition: 
            opacity 100ms ease,
            scale 100ms ease
        ;
    }

    .chat-notification-enter-from,
    .chat-notification-leave-to {
        scale: .8;
        opacity: 0;
    }

   
</style>

<script setup lang="ts">
import ChatComponent from '@/components/Chat.vue';
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useStompStore } from '@/stores/stomp.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { format } from 'date-fns';
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
            stompStore.send('/app/user.connectUser', {id: authStore.authentication.userId})
        });
        emitter.on('disconnected', () => {
            stompStore.send('/app/user.disconnectUser', {id: authStore.authentication.userId})
        });

        emitter.on('statusNotification', chatStore.fetchUsersOnlineCount);
    })

    function handleOnMessage(body: string) {
        const message: Message = JSON.parse(body);

        if (message.chat != currentChat.value.id) {
            notificationStore.add(message.chat);
        }  
    }

    window.addEventListener('beforeunload', () => {
        stompStore.send('/app/user.disconnectUser', {id: authStore.authentication.userId})
    })

    function logout() {
        authStore.logout();
    }

</script>

<template>
    <div class="antialiased grid grid-cols-3 content-start bg-slate-900 mx-auto container-width text-white">
        <header class="col-span-3 w-full p-4 flex items-center gap-4">
            <h1 class="font-bold text-3xl">WebSocket Chat</h1>
            <fa-icon class="text-2xl" icon="fa-solid fa-comments" />
        </header>

        <div class="flex flex-col w-full">
            <div class="p-4 pb-0 flex flex-col gap-2 ">
                    
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold">Chats</h3>
                    <button class="rounded-full bg-sky-600 hover:bg-slate-500 grid place-items-center w-9 aspect-square">
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

            <div class="flex flex-col gap-4 p-4 pt-6"  v-else>
                <button class="bg-slate-800 w-full rounded-xl flex items-center p-4 gap-4 hover:bg-slate-700 hover:-translate-y-1 transition-all" v-for="chat in chatStore.chats"  @click="openChat(chat)" :class="{'chat-button-selected': chat.id === currentChat.id}">
                    
                    <div class="bg-slate-900 ring-slate-500 ring-1 ring-opacity-20 w-12 grid place-items-center rounded-full aspect-square">
                        <fa-icon icon="fa-solid fa-users" class="block" v-if="chat.type === ChatType.Group"/>
                        <fa-icon icon="fa-solid fa-user" class="block" v-else/>
                    </div>
                 
                    <div class="flex flex-col items-start gap-1">
                        <p class="font-bold">{{ chat.name }}</p>
                        <p class="text-xs text-slate-400" v-if="chat.type === ChatType.Group">{{ chat.online === undefined ? '0' : chat.online }} online now</p>
                        <p class="text-xs text-slate-400" v-else>offline.</p>
                    </div>
                    
                    <div class="ms-auto text-sm text-slate-400"  v-for="notification in notificationStore.notifications">
                        <div class="flex flex-col items-center gap-2" v-if="notification.show && notification.chat === chat.id" >
                            <p class="text-xs">{{ format(notification.timestamp, "HH:mm") }}</p>
                            <div class="rounded-full grid place-items-center w-6 bg-sky-600 aspect-square text-white font-semibold"><p>{{ notification.count }}</p></div>                             
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
</style>

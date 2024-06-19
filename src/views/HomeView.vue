<script setup lang="ts">
    import ChatComponent from '@/components/Chat.vue';
    import { useChatStore } from '@/stores/chat.store';
    import { useMessageStore } from '@/stores/message.store';
    import { useNotificationStore } from '@/stores/notification.store';
    import type { Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';
    import Stomp from 'stompjs';
    import { reactive, ref } from 'vue';


    const chatStore = useChatStore();
    const messageStore = useMessageStore();
    const notificationStore = useNotificationStore();

    const showChat = ref(false);
    const openedChat = ref({} as Chat);
    const state = reactive({loading: false, error: false});

    const socket = new WebSocket('ws://localhost:8080/ws');
    const stomp = Stomp.over(socket);
    stomp.connect({}, onConnected, onError);
    
    function subscribe(chat: string) {
        stomp.subscribe(`/topic/chats/${chat}`, onMessageReceived);
    }

    function onMessageReceived(payload: Stomp.Message) {
        const response: Message = JSON.parse(payload.body);
                
        if (response.chat != openedChat.value.id) {
            notificationStore.add(response.chat);
            return;
        }

        messageStore.add(response);
    }

    function onConnected() {
        state.loading = true;
        chatStore.fetchChats()
            .then(() => subscribeToAll())
            .finally(() => state.loading = false);
    }

    function subscribeToAll() {
        chatStore.chats.map(chat => {
            subscribe(chat.id);
        });
    }

    function onError() { console.log('Websocket error'); }

    function openChat(chat: Chat) {
        openedChat.value = chat;
        showChat.value = true; 

        notificationStore.read(chat.id);
    }
</script>

<template>
    <div class="chats">
        <div class="loading" v-if="state.loading">Loading...</div>

        <div v-for="chat in chatStore.chats" class="chat" v-else>
            <button @click="openChat(chat)" type="button">{{ chat.name }}</button>

            <div v-for="notification in notificationStore.notifications">
                <div class="notification" v-if="notification.show && notification.chat === chat.id">{{ notification.count }} new.</div>
            </div>
        </div>
        
    </div>

    <ChatComponent v-if="showChat" :chat="openedChat" :stomp="stomp"/>
</template> 

<style scoped>
    .chats {
        padding: 1rem;
        border: 1px solid black;
        display: flex;
        gap: 1rem;
    }

</style>

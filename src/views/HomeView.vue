<script setup lang="ts">
    import { useChatStore } from '@/stores/chat.store';
    import { onMounted, reactive, ref } from 'vue';
    import ChatComponent from '@/components/Chat.vue';
    import type { Chat } from '@/types/chat.type';
import { useNotificationStore } from '@/stores/notification.store';

    // import { reactive, ref } from "vue";
    // import Stomp from "stompjs";


    // const chat = "ca3eb690-7afa-4a5d-b65f-e07cca178cf2";

    // const message = ref("");
    // const username = ref("");
    // const connected = ref(false);

    // const messages = ref([] as string[]);

    // const socket = new WebSocket("ws://localhost:8080/ws");
    // let stomp = Stomp.over(socket);

    // stomp.connect({}, onConnected, onError);

    // function connect() { }

    // function onConnected() {
    //     connected.value = true;
    //     stomp.subscribe(`/topic/chats/${chat}`, onMessageReceived);
    // }

    // function onError() {
    //     console.log("error");
    // }

    // function onMessageReceived(payload: Stomp.Message) {
    //     const message: Message = JSON.parse(payload.body);

    //     messages.value.push(`(${message.sender}): ${message.content}`);
    // }

    // function sendMessage() {
    //     const chatMessage = {
    //         senderId: 1,
    //         chatId: chat,
    //         content: message.value,
    //     };

    //     stomp.send(`/app/chats/${chat}.sendMessage`, {}, JSON.stringify(chatMessage));
    // }

    const store = useChatStore();
    const notificationStore = useNotificationStore();
    const openedChat = ref({} as Chat);
    const showChat = ref(false);

    onMounted(() => {
        store.fetchChats();

        console.log(notificationStore.notifications);
        
    })

    function openChat(chat: Chat) {
        openedChat.value = chat;
        showChat.value = true; 

        
        notificationStore.read(chat.id);
    }
</script>

<template>
    <div class="chat-wrapper">
        <div v-for="chat in store.chats" class="chat">
            <button @click="openChat(chat)" type="button">{{ chat.name }}</button>

            <div v-for="notification in notificationStore.notifications">
                <div class="notification" v-if="notification.show && notification.chat === chat.id">{{ notification.count }} new.</div>
            </div>
        </div>
        
    </div>

    <ChatComponent v-if="showChat" :chat="openedChat"/>
</template>

<style scoped>
    .chat-wrapper {
        padding: 1rem;
        border: 1px solid black;
        display: flex;
        gap: 1rem;
    }

</style>

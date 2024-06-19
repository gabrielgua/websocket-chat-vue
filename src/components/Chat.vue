<script setup lang="ts">
    import { useMessageStore } from '@/stores/message.store';
    import { computed, onMounted, onUpdated, reactive, ref, watch, type ComputedRef, type Ref } from 'vue';
    import Stomp, { type Subscription } from 'stompjs';
    import type { Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';
    import type { Notification } from "@/types/notification.type";
import { useNotificationStore } from '@/stores/notification.store';


    const props = defineProps<{
        chat: Chat,
    }>();

    const message = ref('');

    const store = useMessageStore();
    const notificationStore = useNotificationStore();

    const chatId = computed(() => props.chat.id);

    const notifications: Ref<Notification[]> = ref([]);


    const socket = new WebSocket('ws://localhost:8080/ws');
    const stomp = Stomp.over(socket);
    stomp.connect({}, onConnected, onError);


    const currentSub = ref({} as Subscription);

    const chatSubscriptions: Ref<string[]> = ref([]); 


    onMounted(() => {
        store.fetchMessages(chatId.value);
    })

    watch(chatId, (newId) => {
        store.fetchMessages(newId);

        subscribe(newId);        
    })


    function subscribe(chat: string) {
        if (!chatSubscriptions.value.includes(chat)) {
            currentSub.value = stomp.subscribe(`/topic/chats/${chat}`, onMessageReceived);
            chatSubscriptions.value.push(chat);
        }
    }

    function onConnected() {
    	subscribe(chatId.value);    
    }

    function onMessageReceived(payload: Stomp.Message) {
        const response: Message = JSON.parse(payload.body);
        

        console.log(response);
        
        if (response.chat != chatId.value) {
            notificationStore.add(response.chat);
            return;
        }

        store.messages.push(response);
    }

    function onError() {
        console.log('Websocket error try again');   
    }

    function sendMessage() {
        const chatMessage = {
            senderId: 1,
            chatId: chatId.value,
            content: message.value,
        };

        console.log(chatId.value);
        
        stomp.send(`/app/chats/${chatId.value}.sendMessage`, {}, JSON.stringify(chatMessage));
    }


</script>

<template>
    <div class="container">
        <div class="chatbox">
            <h2>{{ props.chat.name }}</h2>
            <h5>{{ props.chat.id }}</h5>

            <div class="chat-messages">
                <div v-for="message in store.messages" class="message">
                    ({{ message.sender }}) - {{ message.content }}
                </div>
            </div>

            <form @submit.prevent="sendMessage">
                <input v-model="message" type="text" class="chat-input" placeholder="Type your message" />
                <button type="submit">Send</button>
            </form>
        </div>

    </div>
</template>



<style scoped>

</style>
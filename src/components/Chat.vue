<script setup lang="ts">
    import { useMessageStore } from '@/stores/message.store';
    import type { Chat } from '@/types/chat.type';
    import Stomp from 'stompjs';
    import { computed, onMounted, ref, watch } from 'vue';


    const props = defineProps<{
        chat: Chat,
        stomp: Stomp.Client
    }>();

    const message = ref('');
    const messageStore = useMessageStore();
    const chatId = computed(() => props.chat.id);

    onMounted(() => {
        messageStore.fetchMessages(chatId.value);     

        watch(chatId, (newId) => {
            messageStore.fetchMessages(newId);     
        })
    })
    
    function sendMessage() {
        const chatMessage = {
            senderId: 1,
            chatId: chatId.value,
            content: message.value,
        };
        
        props.stomp.send(`/app/chats/${chatId.value}.sendMessage`, {}, JSON.stringify(chatMessage));
        message.value = '';
    }


</script>

<template>
    <div class="container">
        <div class="chatbox">
            <h2>{{ props.chat.name }}</h2>
            <h5>{{ props.chat.id }}</h5>

            <div class="chat-messages">
                <div v-for="message in messageStore.messages" class="message">
                    ({{ message.sender }}) - {{ message.content }}
                </div>
            </div>

            <form @submit.prevent="sendMessage">
                <input required v-model="message" type="text" class="chat-input" placeholder="Type your message" />
                <button type="submit">Send</button>
            </form>
        </div>

    </div>
</template>

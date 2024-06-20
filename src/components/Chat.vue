<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth.store';
    import { useMessageStore } from '@/stores/message.store';
    import type { Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';    
    import Stomp from 'stompjs';
    import { format } from 'date-fns';
    import { computed, onMounted, ref, watch, type Ref } from 'vue';


    

    const props = defineProps<{
        chat: Chat,
        stomp: Stomp.Client
    }>();

    const message = ref('');
    const authStore = useAuthStore();
    const messageStore = useMessageStore();
    const chatId = computed(() => props.chat.id);
    const chatbox = ref({} as HTMLElement);
    const messageEl = ref({} as HTMLElement);

    onMounted(() => {
        messageStore.fetchMessages(chatId.value);     
        scrollToBottom('instant');

        

        watch(chatId, (newId) => {
            messageStore.fetchMessages(newId);     
            scrollToBottom('instant');
        })
    })

    
    function scrollToBottom(behavior: ScrollBehavior) {
        console.log(chatbox.value);
        
        setTimeout(() => {
            chatbox.value.scrollTo({top: chatbox.value.scrollHeight, behavior: behavior});
        }, 15);
    }

    defineExpose({ scrollToBottom });
    function sendMessage() {
        scrollToBottom('smooth');
        const chatMessage = {
            senderId: authStore.authentication.senderId,
            chatId: chatId.value,
            content: message.value,
        };
        
        props.stomp.send(`/app/chats/${chatId.value}.sendMessage`, {}, JSON.stringify(chatMessage));
        message.value = '';
    }

    function formatTimestamp(timestamp: Date) {
        return format(timestamp, "HH:mm");
    }




</script>

<template>
    <div class="container">
        <div class="chatbox">
            <h2>{{ props.chat.name }}</h2>
            <h5>{{ props.chat.id }}</h5>

            <div class="chat-messages" ref="chatbox">
                <div v-for="message in messageStore.messages" class="message" :class="{'sender': message.sender === authStore.authentication.username}">
                    <div class="message-header">
                        <small><strong>{{ message.sender }}</strong></small>
                    </div>

                    <p>{{ message.content }}</p>
                </div>
                
            </div>

            <form @submit.prevent="sendMessage">
                <input required v-model="message" type="text" class="chat-input" placeholder="Type your message" />
                <button type="submit">Send</button>
            </form>
        </div>

    </div>
</template>

<style scoped>
    .container {
        padding: 1rem;
    }

    .chatbox {
        width: min(400px, 100% - 4rem);
    }

    .chat-messages {
        max-height: 80dvh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border: 1px solid red;
    }

    .sender {
        text-align: end;
        align-self: end;
    }


    .message {
        margin-bottom: .25rem;
        max-width: 50%;
    }

    form {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr auto;
    }

 
</style>

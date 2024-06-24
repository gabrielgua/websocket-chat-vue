<script setup lang="ts">
    import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useMessageStore } from '@/stores/message.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useStompStore } from '@/stores/stomp.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { format } from 'date-fns';
import { on } from 'events';
import mitt from 'mitt';
import { emit } from 'process';
import Stomp from 'stompjs';
import { computed, onActivated, onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue';


    

    const props = defineProps<{
        chat: Chat,
    }>();

    const message = ref('');
    const authStore = useAuthStore();
    const stompStore = useStompStore();
    const notificationStore = useNotificationStore();
    const messageStore = useMessageStore();



    const currentChat = computed(() => props.chat);
    const chatbox = ref({} as HTMLElement);

    function handleMessageReceived(body: string) {
        scrollToBottom('smooth');

        const message: Message = JSON.parse(body);

        if (message.chat === currentChat.value.id) { 
            messageStore.add(message);      
        }
    }

    onMounted(() => {

        scrollToBottom('instant');
        watch(currentChat, (newChat) => {
            messageStore.fetchMessages(newChat.id);   

            scrollToBottom('instant');

        });

        emitter.on('messageReceived', handleMessageReceived)
    })

    function scrollToBottom(behavior: ScrollBehavior) {
        setTimeout(() => {
            chatbox.value.scrollTo({top: chatbox.value.scrollHeight, behavior: behavior});
        }, 15);
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

    function wasSentAtSameTime(current: Message, index: number) {
        if (index === 0) {
            return false;
        }

        var previous = messageStore.messages[index - 1];
        const sameTime = format(previous.timestamp, 'HH:mm') === format(current.timestamp, 'HH:mm');

        if (sameTime && previous.sender != current.sender) {
            return false;
        }

        return sameTime;   

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
</script>

<template>
    <div class="container">
        <div class="chatbox" v-if="showChat()">
            <h2>{{ currentChat.name }}</h2>
            <h5>{{ currentChat.id }}</h5>

            <div class="chat-messages" ref="chatbox">
                <div v-for="(message, i) in messageStore.messages" :key="message.id" class="message" :class="{'sender': isMessageSender(message.sender) }">
                    <div class="message-header" v-if="!isSameSender(message.sender, i) && isGroupChat()">
                        <p><strong>{{ message.sender }}</strong></p>
                        <hr>
                    </div>

                    <div class="message-timestamp" v-if="!wasSentAtSameTime(message, i)">{{ formatTimestamp(message.timestamp) }}</div>
                    <p class="message-content" :class="{
                            'message-sender': isMessageSender(message.sender),
                            'message-group': wasSentAtSameTime(message, i)}
                        ">{{ message.content }}</p>
                </div>
                
            </div>

            <form @submit.prevent="sendMessage">
                <input required v-model="message" type="text" class="chat-input" placeholder="Type your message" />
                <button type="submit">Send</button>
            </form>
        </div>

        <span v-else>Welcome, star chatting now!</span>

    </div>
</template>

<style scoped>
    .container {
        padding: 1rem;
        max-height: 80dvh;
        height: 80dvh;
        border: 1px solid yellow;
    }

    .chatbox {
        width: min(400px, 100% - 4rem);
    }

    .chat-messages {
        --message-border-radius: .75rem;

        max-height: 60dvh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border: 1px solid red;
    }


    .message {
        max-width: 50%;
        display: flex;
        flex-direction: column;
    }

    .sender {
        align-self: flex-end;
        align-items: flex-end;
    }

    .message-header { 
        max-width: max-content;
    }

    .message-header > p {
        margin-bottom: .25rem;
    }
    
    .message-timestamp {
        margin-top: .5rem;
        font-size: small;
    }

    .message-content {
        margin-bottom: .25rem;
        font-size: 18px;
        width: max-content;
        border: 1px solid rgba(0, 0, 0, .1);
        padding: .25rem .5rem;
        border-radius: .25rem .75rem var(--message-border-radius) var(--message-border-radius);
    }

    .message-sender {
        background-color: whitesmoke;
        border-color: white;
        border-radius: var(--message-border-radius) .25rem var(--message-border-radius) var(--message-border-radius);
    }

    .message-group {
        border-radius: var(--message-border-radius) ;
        margin-top: 0;
    }

    form {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr auto;
    }

 
</style>

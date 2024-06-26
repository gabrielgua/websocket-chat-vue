<script setup lang="ts">
    import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useMessageStore } from '@/stores/message.store';
import { useStompStore } from '@/stores/stomp.store';
import { ChatType, type Chat } from '@/types/chat.type';
import type { Message } from '@/types/message.type';
import { differenceInDays, differenceInHours, format, getDay, getDayOfYear, getDaysInMonth, isSameDay } from 'date-fns';
import { computed, onMounted, ref, watch } from 'vue';

    const props = defineProps<{
        chat: Chat,
    }>();

    const message = ref('');
    const authStore = useAuthStore();
    const stompStore = useStompStore();
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

        emitter.on('message', handleMessageReceived);
    })

    function scrollToBottom(behavior: ScrollBehavior) {
        setTimeout(() => {
            if (currentChat.value.id != '0') {
                chatbox.value.scrollTo({top: chatbox.value.scrollHeight, behavior: behavior});
            }
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


        return format(timestamp, "PPPP");
    }
</script>

<template>
    <div class="container">
        <div class="chatbox" v-if="showChat()">
            <h2>{{ currentChat.name }}</h2>
            <h5>{{ currentChat.id }}</h5>

            <div class="chat-messages" ref="chatbox">
                <div v-for="(message, i) in messageStore.messages" :key="message.id" class="message" :class="{
                    'sender': isMessageSender(message.sender),
                    'message-group': isSameSender(message.sender, i)
                     }">
                    
                    <span class="message-timestamp-full" :style="{'margin-top': i === 0 ? 0 : '1rem'}" v-if="!sameDay(message, i)">
                        <p>{{ displayFullTimestamp(message.timestamp) }}</p>
                        <span class="divider"></span>
                    </span>
                    <div class="message-header" v-if="!isSameSender(message.sender, i) && isGroupChat()"><small><strong>{{ displaySender(message.sender)  }}</strong></small></div>
                    <div class="message-content" :class="{
                        'message-sender': isMessageSender(message.sender)}">
                        <p class="message-text" >{{ message.content }}</p>
                        <span class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                        <span class="message-first-triangle" :class="{
                            'message-first-triangle-sender': isMessageSender(message.sender)
                            }"
                            :style="{'display': isSameSender(message.sender, i) && sameDay(message, i) ? 'none' : 'block'}"
                            ></span>
                    </div>
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
    }

    .chatbox {
        width: min(600px, 100% - 4rem);
    }

    .chat-messages {
        --message-border-radius: .75rem;

        margin-top: 1rem;
        max-height: 60dvh;
        height: 60dvh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border: 1px solid whitesmoke;
    }

    .message {
        display: flex;
        flex-direction: column;
        /* border: 1px solid black; */
        margin-top: .75rem;
    }

    .message-group {
        margin-top: .25rem;
    }

    .sender {
        align-items: flex-end;
    }

    .message-header { 
        margin-top: 1rem;
        font-size: small;
    }
    
    .message-content {
        --clr-bg: lightblue;

        display: flex;
        justify-content: space-between;
        gap: .5rem;
        font-size: 15px;
        width: max-content;
        max-width: 70%;
        padding: .25rem .5rem;
        border-radius: var(--message-border-radius);
        background-color: var(--clr-bg);
        position: relative
    }

    .message-first-triangle {
        --r: 4px; /* border radius */

        height: 15px;
        aspect-ratio: 2;
        --_g:calc(var(--r)/tan(22.5deg)) top var(--r),#000 98%,#0000 101%;
        -webkit-mask:
            conic-gradient(from 157.5deg at 50% calc(var(--r)/(3*sqrt(2) - 4) - 100%/tan(22.5deg)),#000 45deg,#0000 0)
            0 0/100% calc(100% - var(--r)/sqrt(2)) no-repeat,
            radial-gradient(var(--r) at 50% calc(100% - var(--r)*sqrt(2)),#000 98%,#0000 101%),
            radial-gradient(var(--r) at left  var(--_g)),
            radial-gradient(var(--r) at right var(--_g));

        mask: 
            conic-gradient(from 157.5deg at 50% calc(var(--r)/(3*sqrt(2) - 4) - 100%/tan(22.5deg)),#000 45deg,#0000 0)
            0 0/100% calc(100% - var(--r)/sqrt(2)) no-repeat,
            radial-gradient(var(--r) at 50% calc(100% - var(--r)*sqrt(2)),#000 98%,#0000 101%),
            radial-gradient(var(--r) at left  var(--_g)),
            radial-gradient(var(--r) at right var(--_g));
        clip-path: polygon(50% 100%,100% 0,0 0);
        background-color: var(--clr-bg);
        position: absolute;
        top: 0;
        left: -10px;
    }

    .message-first-triangle-sender {
        left: auto;
        right: -10px;
    }

    .message-content > .message-timestamp {
        color: grey;
    }

    .message-timestamp {
        font-size: 11px;
        align-self: flex-end;
        color: darkgray;
        align-self: right;
    }

    .message-timestamp-full {
        width: 100%;
        display: grid;
        gap: 1rem;
        align-items: center;
        grid-template-columns: auto 1fr;
        font-size: small;
        align-self: flex-start;
        margin-block: 1rem;
        padding: .125rem .25rem;
    }

    .message-timestamp-full > .divider {
        border-bottom: 1px solid lightgray;
        width: 100%;
    }

    .message-sender {
        --clr-bg: whitesmoke;
    }

    form {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
    }

    input {
        padding: .5rem;
    }

 
</style>

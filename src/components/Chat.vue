<script setup lang="ts">
    import { emitter } from '@/services/mitt';
    import { useAuthStore } from '@/stores/auth.store';
    import { useMessageStore } from '@/stores/message.store';
    import { useStompStore } from '@/stores/stomp.store';
    import { ChatType, type Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';
    import { differenceInDays, differenceInHours, format, formatRelative, getDay, getDayOfYear, getDaysInMonth, isSameDay, isToday, isYesterday, subDays, type FormatRelativeFn, type Locale } from 'date-fns';
    import { ptBR } from 'date-fns/locale';
    import { computed, onMounted, onUpdated, ref, watch } from 'vue';

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
        // scrollToBottom('smooth');

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
        chatbox.value.scrollTo({top: chatbox.value.scrollHeight, behavior: behavior});
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
        
        return format(timestamp, date, {locale: ptBR}); ;
    }

    function showMessageHeader(message: Message, index: number) {
        const sameSenderDifferentDay = isSameSender(message.sender, index) && !sameDay(message, index);

        return isGroupChat() && (!isSameSender(message.sender, index) || sameSenderDifferentDay) ;
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
                    
                    <span class="message-timestamp-full" v-if="!sameDay(message, i)">
                        <p>{{ displayFullTimestamp(message.timestamp) }}</p>
                        <span class="divider"></span>
                    </span>
                    <div class="message-header" v-if="showMessageHeader(message, i)"><small><strong>{{ displaySender(message.sender)  }}</strong></small></div>
                    <div class="message-content-wrapper" :class="{
                        'message-content-wrapper-sender': isMessageSender(message.sender)}">
                        <div class="message-content" :class="{
                            'message-sender': isMessageSender(message.sender)}">
                            <p class="message-text" >{{ message.content }}</p>
                            <span class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                            <span class="message-first-triangle" :class="{'message-first-triangle-sender': isMessageSender(message.sender)}" :style="{'display': isSameSender(message.sender, i) && sameDay(message, i) ? 'none' : 'block'}"></span>
                        </div>
                        <span class="message-hover-timestamp">{{ format(message.timestamp, "P", {locale: ptBR}) }}</span>
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
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border: 1px solid whitesmoke;
        position: relative;
    }

    .message {
        --space-between: 1.5rem;


        display: flex;
        flex-direction: column;
        margin-top: 1rem;
    }

    .message:hover .message-hover-timestamp {
        display: block;
    }

    .message-group {
        margin-top: .25rem;
    }

    .message-group > .message-timestamp-full {
        margin-top: .75rem;
    }

    .sender {
        align-items: flex-end;
    }

    .message-header { 
        font-size: small;
    }


    .message-content-wrapper {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .message-content-wrapper-sender {
        flex-direction: row-reverse;
    }

    .message-hover-timestamp {
        font-size: 11px;
        color: slategray;
        display: none;
    }
    
    .message-content {
        --clr-bg: lightblue;

        display: flex;
        justify-content: space-between;
        gap: .5rem;
        font-size: 15px;
        width: max-content;
        max-width: 350px;
        padding: .25rem .5rem;
        border-radius: var(--message-border-radius);
        background-color: var(--clr-bg);
        position: relative;
    }

    .message-first-triangle {
        --r: 4px; /* border radius */

        --mask: conic-gradient(from 157.5deg at 50% calc(var(--r)/(3*sqrt(2) - 4) - 100%/tan(22.5deg)),#000 45deg,#0000 0)
            0 0/100% calc(100% - var(--r)/sqrt(2)) no-repeat,
            radial-gradient(var(--r) at 50% calc(100% - var(--r)*sqrt(2)),#000 98%,#0000 101%),
            radial-gradient(var(--r) at left  var(--_g)),
            radial-gradient(var(--r) at right var(--_g));

        height: 15px;
        aspect-ratio: 2;
        --_g:calc(var(--r)/tan(22.5deg)) top var(--r),#000 98%,#0000 101%;
        -webkit-mask: var(--mask);
        mask: var(--mask);
            
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
    }

    .message-timestamp-full {
        --clr-divider: lightgrey;
        
        display: grid;
        place-items: center;
        width: 100%;
        align-self: center;
        font-size: small;
        margin-block: 1rem;
        position: relative;

    }

    .message-timestamp-full > p {
        background-color: white;
        outline: 1rem solid white;
    }

    .message-timestamp-full > .divider {
        width: 100%;
        z-index: -1;
        position: absolute;
        place-self: center;
        border-bottom: 1px solid var(--clr-divider);
        border-radius: .25rem;
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

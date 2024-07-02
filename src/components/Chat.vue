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
        <span class="no-chat-selected" v-if="!showChat()">Welcome, star chatting now!</span>
        <div class="chatbox" v-else>
            <div class="chat-header">
                <h2>{{ currentChat.name }}</h2>
                <h5>{{ currentChat.id }}</h5>
            </div>

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
                            <p style="z-index: 99;">{{ message.content }}</p>
                            <span class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                            <span class="message-first-triangle" :class="{'message-first-triangle-sender': isMessageSender(message.sender)}" :style="{'display': isSameSender(message.sender, i) && sameDay(message, i) ? 'none' : 'block'}"></span>
                        </div>
                        <span class="message-hover-timestamp">{{ format(message.timestamp, "P", {locale: ptBR}) }}</span>
                    </div>
                </div>
                
                
            </div>

            <form @submit.prevent="sendMessage">
                <input required v-model="message" type="text" class="chat-input" placeholder="Type your message" />
                <button class="bg-black" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                </button>
            </form>
        </div>
</template>

<style scoped>
    .no-chat-selected {
        display: grid;
        place-items: center;
        background-color: var(--secondary-clr);
        padding: 5rem;

        color: black;

        font-size: large;
        font-weight: bold;
    }

    .chatbox {
        --chatbox-bg-clr: var(--secondary-clr);
        --chatbox-height: calc(100dvh - 68px - 2rem);

        max-height: var(--chatbox-height);
        height: 100%;
        background-color: var(--chatbox-bg-clr);
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }

    .chat-header {
        padding: 1rem;
        box-shadow: 10px -40px 50px 10px var(--tertiary-clr);
        background-color: whitesmoke;
        z-index: 1;
    }


    .chat-messages {
        --message-border-radius: .75rem;

        flex-grow: 1;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        padding: 1rem;
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
        --clr-bg: var(--container-outline-clr);
        color: var(--secondary-clr);

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
        --r: 1px; /* border radius */

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
        
        display: grid;
        place-items: center;
        width: 100%;
        align-self: center;
        font-size: small;
        margin-block: 1rem;
        position: relative;

    }

    .message-timestamp-full > p {
        background-color: var(--chatbox-bg-clr);
        outline: 1rem solid var(--chatbox-bg-clr);
        z-index: 2;
    }


    .message-timestamp-full > .divider {
        width: 100%;
        z-index: 1;
        position: absolute;
        place-self: center;
        border-bottom: 1px solid lightgrey;
        border-radius: .25rem;
    }

    .message-sender {
        --clr-bg: white;
        color: black;
    }

    form {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        padding: 1rem;
        background-color: var(--tertiary-clr);
        margin-top: auto;
    }

    input {
        padding: .75rem 1rem;
        border-radius: 1.5rem;
        outline: none;
        border: none;
        color: var(--secondary-clr);

        background-color: var(--container-outline-clr);
        transition: outline ease 25ms;
    } 

    input:focus {
        outline: 3px solid var(--primary-clr);
        outline-offset: 2px;
    }

    form > button {
        background-color: var(--primary-clr);
        display: grid;
        place-items: center;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        color: white;
    }

</style>

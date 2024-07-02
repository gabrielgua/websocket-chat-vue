<script setup lang="ts">
import ChatComponent from '@/components/Chat.vue';
    import { emitter } from '@/services/mitt';
    import { useAuthStore } from '@/stores/auth.store';
    import { useChatStore } from '@/stores/chat.store';
    import { useNotificationStore } from '@/stores/notification.store';
    import { useStompStore } from '@/stores/stomp.store';
    import { ChatType, type Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';
    import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';


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
    <div class="container">
        <header>
            <h1>WebSocket Chat</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"/>
            </svg>
        </header>

        <div class="chats">
            <div class="chats-header">
                    
                <h3>Your Chats</h3>

                <div class="profile">
                    <button class="button" type="button" @click="logout">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                        </svg>
                    </button>
                    <!-- <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                    </span> -->
                    <small>{{ authStore.authentication.username }}</small>
                </div>
            </div>
            <div class="loading" v-if="state.loading">Loading...</div>

            <div v-for="chat in chatStore.chats" class="chat" v-else>
                <button class="button chat-button" @click="openChat(chat)" :class="{'chat-button-selected': chat.id === currentChat.id}">
                    <span class="chat-icon" v-if="chat.type === ChatType.Private">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                    </span>
                    <span class="chat-icon" v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                        </svg>
                    </span>
                    <div class="chat-content">
                        <p class="chat-name">{{ chat.name }}</p>
                        <p class="chat-online" v-if="chat.type === ChatType.Group">{{ chat.online === undefined ? '0' : chat.online }} online now</p>
                        <p class="chat-online" v-else>offline.</p>
                    </div>
                    
                    <div class="chat-notification"  v-for="notification in notificationStore.notifications">
                        <div v-if="notification.show && notification.chat === chat.id" >{{ notification.count }} new</div>
                    </div>
                </button>

            </div>
            
            
        </div>

        <ChatComponent :chat="currentChat" />
    </div>
</template> 

<style scoped>
    .container {
        
        --primary-clr: #76ABAE;
        --secondary-clr: #EEEEEE;
        --tertiary-clr: #31363F;
        --container-bg-clr: var(--tertiary-clr);
        --container-width: 1500px;
        --container-margin: 1rem;
        --container-height: calc(100dvh - var(--container-margin) * 2);

        width: min(var(--container-width), 100% - var(--container-margin) * 2);
        margin-inline: auto;
        display: grid;
        grid-template-columns: auto 1fr;  
        grid-template-rows: auto 1fr;
        height: var(--container-height);
        margin-block: var(--container-margin);
        background-color: var(--container-bg-clr);
        overflow: hidden;
    }

    header {
        grid-column: span 2;
        padding: 1rem;
        color: var(--primary-clr);
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .chats {
        border-radius: .5rem;
        display: flex;
        flex-direction: column;
        width: min(500px);
        background-color: var(--container-bg-clr);
    }

    .chats-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background-color: var(--primary-clr);
    }

    .chat-button {
        width: 100%;
        padding: 1rem;
        background-color: var(--tertiary-clr);
        display: flex;
        align-items: center;
    }

    .chat-button:hover {
        transform: none;
        /* background-color: #31363F; */
    }

    .chat-button-selected {
        background-color: var(--container-outline-clr);
        /* color: black; */


    }

    .chat-icon {
        background-color: var(--secondary-clr);
        display: grid;
        place-items: center;
        padding: 1rem;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
        margin-right: 1rem;
    }

    .chat-content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: auto;
    }

    .chat-name {
        text-align: start;
        font-size: larger;
        color: white;
        font-weight: bold;
        width: 100%;
    }

    .chat-online {
        color: rgb(192, 192, 192);
    }
    
    .chat-notification {
        border-radius: 50%;
        color: var(--primary-clr);
        display: flex;
        align-items: center;
        gap: .25rem;
    }   

    .chat-button-header > p {
        font-size: larger;
        font-weight: bold;
        color: white;
    }

    .profile {
        display: flex;
        align-items: center;
        gap: .5rem; 
    }

    .profile > span {
        color: var(--tertiary-clr);

        display: grid;
        place-items: center;
        aspect-ratio: 1 / 1;
    }

    .profile > button {
        display: grid;
        place-items: center;
        aspect-ratio: 1 / 1;
        border: none;
        background-color: transparent;
        color: orangered;
        cursor: pointer;
    }

    .chat-online {
        margin-top: .25rem;
        font-size: 14px;
    }
</style>

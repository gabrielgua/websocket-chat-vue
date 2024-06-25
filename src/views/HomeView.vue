<script setup lang="ts">
    import ChatComponent from '@/components/Chat.vue';
    import { emitter } from '@/services/mitt';
    import { useAuthStore } from '@/stores/auth.store';
    import { useChatStore } from '@/stores/chat.store';
    import { useNotificationStore } from '@/stores/notification.store';
    import { useStompStore } from '@/stores/stomp.store';
    import { ChatType, type Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';
    import Stomp from 'stompjs';
    import { onMounted, reactive, ref } from 'vue';


    const chatStore = useChatStore();
    const authStore = useAuthStore();
    const stompStore = useStompStore();
    const notificationStore = useNotificationStore();

    const currentChat = ref({
        id: '0'
    } as Chat);
    const state = reactive({loading: false, error: false});
    const handlePublic = (payload: Stomp.Message): undefined => {
        chatStore.addOnline();
    }

    function openChat(chat: Chat) {
        currentChat.value = chat;
        notificationStore.read(chat.id);
    }

    onMounted(() => {
        authStore.checkAuthentication();
                
        // stompStore.overridePublicReceived(handlePublic);
        stompStore.connect();
        emitter.on('messageReceived', handleOnMessage);
    })

    function handleOnMessage(body: string) {
        const message: Message = JSON.parse(body);

        if (message.chat != currentChat.value.id) {
            notificationStore.add(message.chat);
        }  
    }

    function logout() {
        authStore.logout();
    }
</script>

<template>
    <div class="chats">
        <div class="loading" v-if="state.loading">Loading...</div>

        <div v-for="chat in chatStore.chats" class="chat" v-else>
            <button @click="openChat(chat)" type="button">{{ chat.name }}</button>
            <p class="chat-online" v-if="chat.type === ChatType.Group">{{ chat.online }} online</p>
            <div v-for="notification in notificationStore.notifications">
                <div class="notification" v-if="notification.show && notification.chat === chat.id">{{ notification.count }} new.</div>
            </div>
        </div>
        <div>
            <strong>({{ authStore.authentication.username }})</strong>
            <button type="button" @click="logout">Logout</button>
        </div>
        
    </div>

    <ChatComponent :chat="currentChat" />
</template> 

<style scoped>
    .chats {
        padding: 1rem;
        border: 1px solid black;
        display: flex;
        gap: 1rem;
    }

    .chat-online {
        margin-top: .25rem;
        font-size: 14px;
    }

</style>

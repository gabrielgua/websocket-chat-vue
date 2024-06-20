import { defineStore } from "pinia"
import { reactive, ref, type Ref } from "vue";
import Stomp from 'stompjs';
import { useChatStore } from "./chat.store";

export const useStompStore = defineStore('stomp', () => {

    const socket = new WebSocket('ws://localhost:8080/ws');
    const stomp = Stomp.over(socket);
    const onMessageReceived: Ref<(payload: Stomp.Message) => void> = ref(() => void {})
    const onPublicReceived: Ref<(payload: Stomp.Message) => void> = ref(() => void {})

    const chatStore = useChatStore();
    const state = reactive({loading: false, error: false});


    function overrideMessageReceived(override: (payload: Stomp.Message) => void) {
        console.log('override');
        
        onMessageReceived.value = override;
    }

    function overridePublicReceived(override: (payload: Stomp.Message) => void) {
        onPublicReceived.value = override;
    }

    function connect() {
        stomp.connect({}, onConnected, onError);
    }

    function onError() {}

    function onConnected() {
        state.loading = true;
        stomp.subscribe('/users/public', onPublicReceived.value);
        chatStore.fetchChats()
            .then(() => subscribeToAll())
            .finally(() => state.loading = false);
        
    }

    function subscribeToAll() {
        chatStore.chats.map(chat => {
            subscribe(chat.id);
        });
    }

    function subscribe(chat: string) {
        stomp.subscribe(`/topic/chats/${chat}`, onMessageReceived.value);
    }

    


    return { connect, stomp, overrideMessageReceived }
});
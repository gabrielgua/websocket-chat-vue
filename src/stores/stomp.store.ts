import { emitter } from "@/services/mitt";
import { defineStore } from "pinia";
import Stomp from 'stompjs';
import { reactive, ref, type Ref } from "vue";
import { useChatStore } from "./chat.store";

export const useStompStore = defineStore('stomp', () => {

    const chatStore = useChatStore();
    const state = reactive({loading: false, error: false});
    const subscriptions: Ref<Stomp.Subscription[]> = ref([]);
    let stomp = Stomp.client('');
    
    function connect() {
        stomp = Stomp.over(new WebSocket('ws://localhost:8080/ws')); 
        stomp.connect({}, onConnected, onError);
    }

    function onError() {}

    function onConnected() {
        if (!subscriptions.value.length) {

            chatStore.fetchChats()
                .then(() => subscribeAll())
                .finally(() => state.loading = false);
        }
    }

    function subscribeAll() {
        chatStore.chats.forEach(chat => {
            subscriptions.value.push(subscribe(chat.id));      
        });
    }

    function unsubscribeAll() {
        subscriptions.value.forEach(sub => sub.unsubscribe());
    }

    function subscribe(chat: string) {
        return stomp.subscribe(`/topic/chats/${chat}`, emitReceived);
    }

    function emitReceived(message: Stomp.Message) {
        emitter.emit('messageReceived', message.body);
    }

    function send(topic: string, payload: Object) {
        stomp!.send(topic, {}, JSON.stringify(payload));
    }

    function disconnectAndUnsubscribe() {
        unsubscribeAll();
        stomp!.disconnect(() => console.log('disconnected from stomp web server'));
    }


    return { stomp, send, connect, subscribe, subscribeAll, disconnectAndUnsubscribe }
});
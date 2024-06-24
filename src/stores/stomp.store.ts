import { defineStore } from "pinia";
import Stomp from 'stompjs';
import { reactive, ref, type Events, type Ref } from "vue";
import { useChatStore } from "./chat.store";
import { useMessageStore } from "./message.store";
import { emitter } from "@/services/mitt";
import type { Message } from "@/types/message.type";

export const useStompStore = defineStore('stomp', () => {


    const socket = new WebSocket('ws://localhost:8080/ws');
    const stomp = Stomp.over(socket);
    stomp.connect({}, onConnected, onError);

    const chatStore = useChatStore();
    const state = reactive({loading: false, error: false});
    const subscriptions: Stomp.Subscription[] = [];


    function connect() {
    }

    function onError() {}

    function onConnected() {
        chatStore.fetchChats()
            .then(() => subscribeAll());
    }

    function subscribeAll() {
        chatStore.chats.forEach(chat => {
            subscriptions.push(subscribe(chat.id));      
        });
    }

    function unsubscribeAll() {
        subscriptions.forEach(sub => sub.unsubscribe());
    }

    function subscribe(chat: string) {
        return stomp.subscribe(`/topic/chats/${chat}`, emitReceived);
    }

    function emitReceived(message: Stomp.Message) {
        emitter.emit('messageReceived', message.body);
    }

    function send(topic: string, payload: Object) {
        stomp.send(topic, {}, JSON.stringify(payload));
    }


    return { stomp, send, connect, subscribe, unsubscribeAll, subscribeAll }
});
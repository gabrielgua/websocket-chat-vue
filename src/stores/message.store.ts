import { http } from "@/services/http";
import type { Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import { useAuthStore } from "./auth.store";

export const useMessageStore = defineStore('message', () => {

    const messages: Ref<Message[]> = ref([]);
    const authStore = useAuthStore();
    const state = reactive({loading: false, error: false});


    function reset() {
        messages.value = [];
        state.error = false;
        state.loading = false;
    }


    function add(message: Message) {
        messages.value.push(message);   
    }


    function fetchMessages(chat: string) {
        state.loading = true;
        messages.value = [];

        return http.get(`/chats/${chat}/messages`)
            .then((response) => {
                response.data.map((message: Message) => {
                    messages.value.push(message);
                });                
            }).catch(e => {
                state.error = true;
                console.log(e);
            }).finally(() => state.loading = false)
    }

    function isSender(message: Message) {
        return authStore.authentication.username === message.sender;
    }

    return { messages, state, fetchMessages, reset, add, isSender }
});
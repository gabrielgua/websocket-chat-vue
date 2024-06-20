import { http } from "@/services/http";
import type { Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";

export const useMessageStore = defineStore('message', () => {

    const messages: Ref<Message[]> = ref([]);
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

        http.get(`/chats/${chat}/messages`)
            .then((response) => {
                response.data.map((message: Message) => {
                    messages.value.push(message);
                });                
            }).catch(e => {
                state.error = true;
                console.log(e);
            }).finally(() => state.loading = false)
    }

    return { messages, state, fetchMessages, reset, add }
});
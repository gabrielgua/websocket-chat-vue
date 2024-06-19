import { http } from "@/services/http";
import type { Chat } from "@/types/chat.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";

export const useChatStore = defineStore('chat', () => {

    const chats: Ref<Chat[]> = ref([]);
    const state = reactive({loading: false, error: false});

    function fetchChats() {
        return http.get('/chats')
            .then(response => {
                state.error = false;
                response.data.map((chat: Chat) => {
                    chats.value.push(chat);
                })
            }).catch(e => {
                state.error = true;
                console.log(e);
            }).finally(() => {
                state.loading = false;
            });
    }


    return { chats, state, fetchChats }
});
import { http } from "@/services/http";
import type { Chat } from "@/types/chat.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import { useAuthStore } from "./auth.store";
import ChatList from "@/components/ChatList.vue";

export const useChatStore = defineStore('chat', () => {

    const chats: Ref<Chat[]> = ref([]);
    const state = reactive({loading: false, error: false});
    const authStore = useAuthStore();

    function fetchChats() {
        chats.value = [];
        return http.get(`/chats?user=${authStore.authentication.userId}`)
            .then(response => {
                state.error = false;
                response.data.map((chat: Chat) => {
                    chats.value.push(chat);
                })

                fetchUsersOnlineCount();
                return chats.value
            }).catch(e => {
                state.error = true;
                console.log(e);
            }).finally(() => {
                state.loading = false;
            });
    }

    function fetchUsersOnlineCount() {
        chats.value
            .filter(chat => chat.type === 'GROUP')
            .forEach(chat => {
                http.get(`/chats/${chat.id}/users/count`) 
                    .then(response => {
                        chat.online = response.data.online;
                        chat.members = response.data.members;
                        chat.offline = response.data.offline;
                    })
            });
    }


    return { chats, state, fetchChats, fetchUsersOnlineCount }
});
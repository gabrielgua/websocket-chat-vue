import { http } from "@/services/http";
import { ChatType, type Chat, type ChatStatusCount } from "@/types/chat.type";
import type { Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import { useAuthStore } from "./auth.store";
import { UserStatus, type User } from "@/types/user.type";

export const useChatStore = defineStore('chat', () => {

    const chats: Ref<Chat[]> = ref([]);
    const state = reactive({ loading: false, error: false });
    const authStore = useAuthStore();

    function fetchChats() {
        chats.value = [];
        return http.get(`/chats`, { headers: { Authorization: `Bearer ${authStore.authentication.token}` } })
            .then(response => {
                state.error = false;
                response.data.map((chat: Chat) => {
                    chats.value.push(chat);
                })

                fetchChatStatusCount();
                sortChatsByLastMessage();

            }).catch(e => {
                state.error = true;
                console.log(e);
            }).finally(() => {
                state.loading = false;
            });
    }

    function fetchChatStatusCount() {
        chats.value
            .forEach(chat => {
                http.get(`/chats/${chat.id}/users/status`)
                    .then(response => {
                        const statusCount: ChatStatusCount = {
                            online: response.data.statusCount.online,
                            members: response.data.statusCount.members,
                            offline: response.data.statusCount.offline
                        }

                        chat.statusCount = statusCount;
                        if (response.data.receiver) {
                            chat.receiver = response.data.receiver;
                        }
                    })
            });
    }

    function updateLastMessage(message: Message) {
        const chat = chats.value.find(c => c.id === message.chat);
        if (chat) {
            chat.lastMessage = message;
        }
    }

    function sortChatsByLastMessage() {
        chats.value = chats.value.sort((a: Chat, b: Chat) => {
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }

    function isReceiverOnline(chat: Chat) {
        if (chat.receiver) {
            return chat.receiver.status === UserStatus.Online;
        }
    }

    function isGroupChat(chat: Chat) {
        return chat.type === ChatType.Group;
    }


    return { 
        chats, 
        state, 
        fetchChats, 
        fetchChatStatusCount, 
        updateLastMessage, 
        sortChatsByLastMessage, 
        isReceiverOnline, 
        isGroupChat, 
    }
});
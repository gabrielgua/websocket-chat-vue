import { http } from "@/services/http";
import { ChatType, type Chat, type ChatShort, type ChatStatusCount } from "@/types/chat.type";
import type { Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import { useAuthStore } from "./auth.store";
import { UserStatus, type User } from "@/types/user.type";

export const useChatStore = defineStore('chat', () => {

    const chats: Ref<Chat[]> = ref([]);
    const current: Ref<Chat> = ref<Chat>({} as Chat);
    const state = reactive({ loading: false, error: false });
    const authStore = useAuthStore();

    function fetchChats() {
        state.loading = true;
        chats.value = [];
        return http.get(`/chats`)
            .then(response => {
                state.error = false;
                response.data.map((chat: Chat) => {
                    chats.value.push(chat);
                })
                sortChatsByLastMessage();
            }).catch(e => {
                state.error = true;
                console.log(e);
            }).finally(() => {
                state.loading = false;
            });
    }

    function changeCurrent(chat: Chat) {
        current.value = chat;
    }

    function currentIsEmpty() {
        return Object.keys(current.value).length === 0;
    }

    function find(chatId: string) {
        return chats.value.find(chat => chat.id === chatId);
    }

    function fetchChatStatusCount() {
        http.get(`/chats/status`).then(response => {

            response.data.map((short: ChatShort) => {
                
                const chat = find(short.id);
                const index = chats.value.findIndex(c => c.id === short.id);
                if (chat && index != -1) {
                    if (chat.type === ChatType.private) {
                        chat.receiver = short.receiver;
                        return;
                    } 
                    
                    chat.statusCount.online = short.statusCount.online;
                    chat.statusCount.members = short.statusCount.members;
                    chat.statusCount.offline = short.statusCount.offline;
                }
            });
        })
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
        return chat.type === ChatType.group;
    }


    return { 
        chats, 
        current,
        changeCurrent,
        state, 
        fetchChats, 
        fetchChatStatusCount, 
        updateLastMessage, 
        sortChatsByLastMessage, 
        isReceiverOnline, 
        isGroupChat, 
        find,
        currentIsEmpty
    }
});
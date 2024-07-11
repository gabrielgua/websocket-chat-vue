import { defineStore } from "pinia";
import { useChatStore } from "./chat.store";
import { ref, type Ref } from "vue";
import type { Message } from "@/types/message.type";
import { http } from "@/services/http";
import type { Chat } from "@/types/chat.type";

export const useUnreadStore = defineStore('unread', () => {

    const API_URL = "/users/messages/unread";

    const chatStore = useChatStore();
    const unread: Ref<Message[]> = ref([]);

    function fetch() {
        unread.value = [];
        http.get(`${API_URL}`)
            .then(response => {
                response.data.map((message: Message) => unread.value.push(message));
                setUnreadCountForAllChats();
            })
    }

    function setUnreadCountForAllChats() {
        chatStore.chats.forEach(chat => {
            setUnreadCountForChat(chat);
        })
    }

    function setUnreadCountForChat(chat: Chat) {
        chat.notifications = unread.value.filter(message => message.chat === chat.id).length;
    }

    function add(message: Message) {
        http.put(`${API_URL}/add/${message.id}`)
            .then(() => {
                unread.value.push(message);
                var chat = chatStore.find(message.chat);
                if (chat) {
                    setUnreadCountForChat(chat);
                }
            });
    }

    
    function read(chat: Chat) {
        var toRemoveIds: number[] = [];
        var toRemove: Message[] = [];
        unread.value.forEach(message => {
            if (message.chat === chat.id) {
                toRemoveIds.push(message.id);
                toRemove.push(message);
            }
        })

        unread.value = unread.value
            .filter(message => !toRemove.includes(message))

        http.delete(`${API_URL}/remove`, {data: toRemoveIds})
            .then(() => setUnreadCountForChat(chat))
    }

    return { read, fetch, add }
})

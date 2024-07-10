import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { Notification } from "@/types/notification.type";
import { useChatStore } from "./chat.store";

export const useNotificationStore = defineStore('notification', () => {

    // const notifications: Ref<Notification[]> = ref([]);
    const chatStore = useChatStore();

    function notify(chatId: string) {
        const chat = chatStore.chats.find(c => c.id === chatId);
        if (chat) {
            chat.notifications += 1;
        }
    }
    
    function read(chatId: string) {
        const chat = chatStore.chats.find(c => c.id === chatId);
        if (chat) {
            chat.notifications = 0;
        }
    }

    function saveNotification() {
        
    }

    return { notify, read }
})

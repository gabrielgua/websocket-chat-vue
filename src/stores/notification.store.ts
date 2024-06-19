import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { Notification } from "@/types/notification.type";

export const useNotificationStore = defineStore('notification', () => {

    const notifications: Ref<Notification[]> = ref([]);

    function reset() {
        notifications.value = [];
    }

    function add(chat: string) {
        const notification = notifications.value.find(n => n.chat === chat);
        if (notification) {
            notification.count += 1;
            return;
        }


        notifications.value.push({chat: chat, show: true, count: 1} as Notification);
    }
    
    function read(chat: string) {
        notifications.value = notifications.value.filter(n => n.chat != chat);
    }

    return { notifications, reset, read, add }
})

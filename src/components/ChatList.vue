<script setup lang="ts">
    import { useChatStore } from '@/stores/chat.store';
    import { ChatType, type Chat } from '@/types/chat.type';
    import type { Message } from '@/types/message.type';
    import { useMessageStore } from '@/stores/message.store';
    import { formatRelative } from 'date-fns';
    import { ptBR } from 'date-fns/locale';
import { useUnreadStore } from '@/stores/unread.store';
import { emitter } from '@/services/mitt';

    const props = defineProps<{
        chats: Chat[]
    }>();


    // const chats: Chat[] = [];
    const chatStore = useChatStore();
    const messageStore = useMessageStore();
    const unreadStore = useUnreadStore();

    function isCurrent(chat: Chat): boolean {
        return chatStore.current.id === chat.id;
    }

    function isGroup(chat: Chat) {
        return chat.type === ChatType.Group;
    }

    function isSender(message: Message) {
        return messageStore.isSender(message);
    }

    function changeCurrent(chat: Chat) {
        chatStore.changeCurrent(chat);

        if (chat.notifications > 0) {
            unreadStore.read(chat);
        }
    } 

    emitter.on('message', handleOnMessage);


    function handleOnMessage(body: string) {
        const message: Message = JSON.parse(body);
        
        chatStore.updateLastMessage(message);
        chatStore.sortChatsByLastMessage();

        if (chatStore.current.id != message.chat) {
            unreadStore.add(message);
        }
    }

</script>

<template>
    <TransitionGroup name="chat-list">
        <button class="group w-full overflow-x-hidden flex items-center p-3 gap-4 hover:bg-slate-800 transition-all"
            v-for="chat in chats" :key="chat.id" @click="changeCurrent(chat)"
            :class="{ 'bg-slate-800': isCurrent(chat) }">

            <div class="relative w-12 min-w-12 grid place-items-center rounded-full aspect-square group-hover:bg-slate-900"
                :class="[isCurrent(chat) ? 'bg-slate-900' : 'bg-slate-800']">
                <fa-icon icon="fa-solid fa-users" class="block" v-if="isGroup(chat)" />
                <fa-icon icon="fa-solid fa-user" class="block" v-else />

                <div class="absolute top-1 right-1 grid place-items-center" v-if="!isGroup(chat)">
                    <span :class="[chatStore.isReceiverOnline(chat) ? 'bg-emerald-500' : 'bg-slate-600',isCurrent(chat) ? 'outline-slate-800' : 'outline-slate-900']"
                        class="rounded-full w-2 aspect-square outline outline-4 group-hover:outline-slate-800"></span>
                </div>
            </div>

            <div class="flex flex-col truncate flex-grow items-start gap-1">
                <p class="font-bold">{{ chat.name }}</p>
                <p class="text-xs text-slate-400 truncate max-w-full">
                    <span class="font-semibold" v-if="chat.type === ChatType.Group">{{ isSender(chat.lastMessage) ? 'You' : chat.lastMessage.sender }}: </span>
                    {{ chat.lastMessage.content }}
                </p>
            </div>

            <div class="ms-auto text-sm text-slate-400 min-w-max h-full">
                <div class="flex flex-col h-full items-end">
                    <p class="text-[11px] mb-auto">{{ formatRelative(chat.lastMessage.timestamp, new Date(),
                        { locale: ptBR }) }}</p>
                    <div class="text-right flex items-center gap-3 ">
                        <Transition name="chat-notification">
                            <p class="rounded-full grid place-items-center w-5 bg-sky-600 aspect-square text-white font-semibold"
                                v-if="chat.notifications > 0">{{ chat.notifications }}</p>
                        </Transition>
                    </div>
                </div>
            </div>
        </button>
    </TransitionGroup>
</template>



<style scoped>
    .chat-list-enter-active,
    .chat-list-leave-active {
        transition: all 0.25s ease;
    }

    .chat-list-enter-from,
    .chat-list-leave-to {
        opacity: 0;
        scale: .9;
    }

    .chat-notification-enter-active,
    .chat-notification-leave-active {
        transition:
            opacity 100ms ease,
            scale 100ms ease;
    }

    .chat-notification-enter-from,
    .chat-notification-leave-to {
        scale: .8;
        opacity: 0;
    }
</style>

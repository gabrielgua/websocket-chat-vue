<script setup lang="ts">
import ChatComponent from '@/components/Chat.vue';
import ChatList from '@/components/ChatList.vue';
import Header from '@/components/Header.vue';
import { emitter } from '@/services/mitt';
import { useChatStore } from '@/stores/chat.store';
import { type Chat } from '@/types/chat.type';
import { computed, ref, type ComputedRef } from 'vue';


const chatStore = useChatStore();
const chatSearch = ref('');

const filteredChats: ComputedRef<Chat[]> = computed(() => {
    return chatStore.chats.filter(chat => {
        return chat.name.toLowerCase().includes(chatSearch.value.trim().toLowerCase());
    });
})

emitter.on('statusNotification', chatStore.fetchChatStatusCount);

</script>

<template>
    <div class="antialiased grid md:grid-cols-3 sm:grid-cols-2 content-start bg-slate-900 mx-auto container-width text-white">
        <Header></Header>

        <div class="flex flex-col w-full">
            <div class="p-4 pb-0 flex flex-col gap-2">

                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold">Chats</h3>
                    <button class="rounded-full bg-sky-600 hover:bg-sky-700 grid place-items-center w-9 aspect-square">
                        <fa-icon icon="fa-solid fa-add" />
                    </button>
                </div>
                <div class="bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
                    <fa-icon icon="fa-solid fa-magnifying-glass" />
                    <input v-model="chatSearch"
                        class="bg-transparent p-3 w-full outline-none text-white font-light text-sm"
                        placeholder="Search chats" type="text">
                </div>

                <div class="grid grid-cols-3 mt-2 gap-4">
                    <button
                        class="flex items-center gap-2 justify-center bg-slate-800 py-1 rounded-xl hover:bg-slate-700 transition-all">
                        <fa-icon icon="fa-solid fa-comment" class="text-sm text-slate-500"></fa-icon>
                        <p class="text-sm">All</p>
                    </button>
                    <button
                        class="flex items-center gap-2 justify-center bg-slate-800 py-1 rounded-xl hover:bg-slate-700 transition-all">
                        <fa-icon icon="fa-solid fa-user" class="text-sm text-slate-500"></fa-icon>
                        <p class="text-sm">Private</p>
                    </button>
                    <button
                        class="flex items-center gap-2 justify-center bg-slate-800 py-1 rounded-xl hover:bg-slate-700 transition-all">
                        <fa-icon icon="fa-solid fa-users" class="text-sm text-slate-500"></fa-icon>
                        <p class="text-sm">Group</p>
                    </button>
                </div>

                <div class="border-b border-slate-800 mt-4"></div>

            </div>

            <div class="flex flex-col pt-6">
                <ChatList :chats="filteredChats"></ChatList>
            </div>
        </div>

        <ChatComponent class="md:col-span-2 sm:col-span-1" />
    </div>
</template>

<style scoped>
    .container-width {
        --container-width: 1500px;
        --container-margin: 1rem;
        --container-height: calc(100dvh - var(--container-margin) * 2);

        margin-block: var(--container-margin);

        width: min(var(--container-width), 100%);
        height: var(--container-height);
    }

    @media (max-width: 1500px) {
        .container-width {
            --container-margin: 0;
            --container-height: 100dvh;
        }
    }
</style>

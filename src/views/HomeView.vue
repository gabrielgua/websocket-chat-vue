<script setup lang="ts">
import ChatComponent from '@/components/Chat.vue';
import ChatList from '@/components/ChatList.vue';
import Header from '@/components/Header.vue';
import { emitter } from '@/services/mitt';
import { useChatStore } from '@/stores/chat.store';
import { ChatFilter, ChatType, type Chat } from '@/types/chat.type';
import { computed, onMounted, ref, type ComputedRef } from 'vue';


const chatStore = useChatStore();
const chatSearch = ref('');
const chatFilter = ref<ChatFilter>(ChatFilter.all);

const filteredChats: ComputedRef<Chat[]> = computed(() => {
    function filter(chat: Chat) {
        const includesTerm = chat.name.toLowerCase().includes(chatSearch.value.trim().toLowerCase());
        if (chatFilter.value != ChatFilter.all) {
            return includesTerm && chat.type.valueOf() === chatFilter.value?.valueOf();
        }

        return includesTerm;
    }

    return chatStore.chats.filter(chat => filter(chat));
})

emitter.on('statusNotification', chatStore.fetchChatStatusCount);


function changeFilter(filter: ChatFilter) {
    chatFilter.value = filter;
}

function isFilter(filter: ChatFilter) {
    return chatFilter.value === filter;
}

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

                <div class="grid grid-cols-3 mt-2">
                    <button @click="changeFilter(ChatFilter.all)"
                        class="flex items-center gap-2 justify-center py-1 rounded-2xl hover:bg-slate-800 transition-all"
                        :class="{'bg-sky-900 hover:bg-sky-900': isFilter(ChatFilter.all)}"
                        >
                        <fa-icon icon="fa-solid fa-comment" class="text-sm text-sky-600"></fa-icon>
                        <p class="text-sm">All</p>
                    </button>
                    <button @click="changeFilter(ChatFilter.private)"
                        :class="{'bg-sky-900 hover:bg-sky-900': isFilter(ChatFilter.private)}"
                        class="flex items-center gap-2 justify-center py-1 rounded-2xl hover:bg-slate-800 transition-all">
                        <fa-icon icon="fa-solid fa-user" class="text-sm text-sky-600"></fa-icon>
                        <p class="text-sm">Private</p>
                    </button>
                    <button @click="changeFilter(ChatFilter.group)"
                        :class="{'bg-sky-900 hover:bg-sky-900': isFilter(ChatFilter.group)}"
                        class="flex items-center gap-2 justify-center py-1 rounded-2xl hover:bg-slate-800 transition-all">
                        <fa-icon icon="fa-solid fa-users" class="text-sm text-sky-600"></fa-icon>
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

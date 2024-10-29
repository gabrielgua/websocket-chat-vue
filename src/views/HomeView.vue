<script setup lang="ts">
import Button from '@/components/Button.vue';
import ChatComponent from '@/components/Chat.vue';
import ChatForm from '@/components/ChatForm.vue';
import ChatList from '@/components/ChatList.vue';
import Header from '@/components/Header.vue';
import Modal from '@/components/Modal.vue';
import Spinner from '@/components/Spinner.vue';
import { emitter } from '@/services/mitt';
import { useChatStore } from '@/stores/chat.store';
import { ChatFilter, type Chat } from '@/types/chat.type';
import { computed, ref, type ComputedRef } from 'vue';


const modalActive = ref(false);
const chatStore = useChatStore();
const chatSearch = ref('');
const chatFilter = ref(ChatFilter.all);

emitter.on('chatCreated', () => {
  toggleModal();
})

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

function changeFilter(filter: ChatFilter) {
  chatFilter.value = filter;
}

function isFilter(filter: ChatFilter) {
  return chatFilter.value === filter;
}

type Filter = {
  name: string,
  type: ChatFilter,
  icon: string
}

const filters: Filter[] = [
  { name: 'All', type: ChatFilter.all, icon: 'fa-comment' },
  { name: 'Private', type: ChatFilter.private, icon: 'fa-user' },
  { name: 'Group', type: ChatFilter.group, icon: 'fa-user-group' }
]

function toggleModal() {
  modalActive.value = !modalActive.value;
}

</script>

<template>

  <Header></Header>
  <div
    class="antialiased grid md:grid-cols-3 sm:grid-cols-2 content-start bg-slate-900 mx-auto container-width text-white">

    <div class="flex flex-col w-full overflow-auto h-[calc(100dvh-68px)]">
      <div class="p-4 pb-0 flex flex-col gap-2">

        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">Chats</h3>
          <Button :on-click="toggleModal" icon="fa-add" variant="primary" rounded />
        </div>
        <div class="bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
          <fa-icon icon="fa-solid fa-magnifying-glass" />
          <input v-model="chatSearch" class="bg-transparent p-3 w-full outline-none text-white font-light text-sm"
            placeholder="Search chats" type="text">
        </div>

        <div class="grid grid-cols-3 mt-2">
          <button v-for="filter in filters" @click="changeFilter(filter.type)"
            class="flex items-center gap-2 justify-center py-1 rounded-2xl hover:bg-slate-800 transition-all"
            :class="{ 'bg-slate-800': isFilter(filter.type) }">
            <fa-icon :icon="'fa-solid ' + filter.icon" class="text-sm text-sky-600"></fa-icon>
            <p class="text-sm">{{ filter.name }}</p>
          </button>
        </div>

        <div class="border-b border-slate-800 mt-4"></div>

      </div>

      <div class="flex flex-col pt-6 overflow-y-auto chat-list">
        <ChatList :chats="filteredChats"></ChatList>

      </div>
    </div>

    <ChatComponent class="md:col-span-2 sm:col-span-1" />

    <Modal :modal-active="modalActive" @close-modal="toggleModal" title="Create a new chat">
      <span class="self-center grid place-items-center gap-4" v-if="chatStore.state.loading">
        <Spinner />
        <p class="text-sm text-slate-400">Creating chat</p>
      </span>
      <ChatForm v-else />
    </Modal>
  </div>
</template>

<style scoped>
.container-width {
  --container-width: 1500px;
  --container-margin: 1rem;

  width: min(var(--container-width), 100%);
  height: calc(100dvh - 68px);
}

@media (max-width: 1500px) {
  .container-width {
    --container-margin: 0;
    --container-height: 100dvh;
  }
}

.chat-list:hover ::-webkit-scrollbar-thumb {
  display: block;
}

/* width */
::-webkit-scrollbar {
  width: .25rem;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(2 132 199);
  border-radius: .25rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import ChatComponent from '@/components/Chat/Chat.vue';
import ChatForm from '@/components/Chat/ChatForm.vue';
import ChatList from '@/components/Chat/ChatList.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import Header from '@/components/Header.vue';
import Input from '@/components/Input.vue';
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

    <div class="flex flex-col w-full  h-[calc(100dvh-68px)]">
      <div class="p-4 pb-0 flex flex-col gap-2">

        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg font-bold">Chats</h3>
          <Dropdown icon="fa-ellipsis-vertical" rounded>
            <template #dropdown-items>
              <DropdownItem icon="fa-user-plus">Add friend</DropdownItem>
              <DropdownItem :on-click="toggleModal" icon="fa-comments">New group</DropdownItem>
            </template>
          </Dropdown>

        </div>
        <Input v-model="chatSearch" type="search" placeholder="Search for chats" icon-start="fa-magnifying-glass" />

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

      <ChatList class="pt-6" :chats="filteredChats"></ChatList>

    </div>

    <ChatComponent class="md:col-span-2 sm:col-span-1" />

    <Modal :modal-active="modalActive" @close-modal="toggleModal" title="Create a new group chat">
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
</style>

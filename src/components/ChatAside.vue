<script setup lang="ts">
import { useChatStore } from '@/stores/chat.store';
import { useUserSearchStore } from '@/stores/userSearch.store';
import { type Chat, ChatFilter } from '@/types/chat.type';
import { type ComputedRef, computed, ref } from 'vue';
import { emitter } from '@/services/mitt';
import Modal from '@/components/Modal.vue';
import Spinner from '@/components/Spinner.vue';

import FriendForm from '@/components/FriendForm.vue';
import ChatForm from '@/components/Chat/ChatForm.vue';
import ChatList from './Chat/ChatList.vue';
import Input from './Input.vue';
import Dropdown from './Dropdown/Dropdown.vue';
import DropdownItem from './Dropdown/DropdownItem.vue';



const chatSearch = ref('');
const chatFilter = ref(ChatFilter.all);
const groupModalActive = ref(false);
const friendModalActive = ref(false);
const chatStore = useChatStore();
const searchStore = useUserSearchStore();

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

emitter.on('chatCreated', () => {
  toggleGroupModal();
})

function toggleGroupModal() {
  groupModalActive.value = !groupModalActive.value;
}

function toggleFriendModal() {
  searchStore.reset();
  friendModalActive.value = !friendModalActive.value;
}
</script>

<template>
  <div class="px-4 mt-6 grid gap-3">
    <div class="flex items-center gap-2 justify-between ">
      <h3 class="text-lg font-bold">Chats</h3>
      <Dropdown icon="fa-ellipsis-vertical" rounded>
        <template #dropdown-items>
          <DropdownItem :on-click="toggleFriendModal" icon="fa-user-plus">Add friend</DropdownItem>
          <DropdownItem :on-click="toggleGroupModal" icon="fa-comments">New group</DropdownItem>
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

  </div>
  <hr class="border-slate-800 my-4" />

  <ChatList :chats="filteredChats" />



  <Modal :modal-active="groupModalActive" @close-modal="toggleGroupModal" title="Create a new group chat">
    <span class="self-center grid place-items-center gap-4" v-if="chatStore.state.loading">
      <Spinner />
      <p class="text-sm text-slate-400">Creating chat</p>
    </span>
    <ChatForm v-else />
  </Modal>

  <Modal :modal-active="friendModalActive" @close-modal="toggleFriendModal" title="Find and add users">
    <FriendForm />
  </Modal>
</template>


<style scoped></style>
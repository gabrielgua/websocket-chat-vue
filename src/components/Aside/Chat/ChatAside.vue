<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import Spinner from '@/components/Spinner.vue';
import { emitter } from '@/services/mitt';
import { useChatStore } from '@/stores/chat.store';
import { type Chat, ChatFilter } from '@/types/chat.type';
import { type ComputedRef, computed, ref } from 'vue';

import ChatForm from '@/components/Chat/ChatForm.vue';
import Dropdown from '../../Dropdown/Dropdown.vue';
import DropdownItem from '../../Dropdown/DropdownItem.vue';
import Input from '../../Input.vue';
import ChatList from './ChatList.vue';
import JumpInTransition from '@/components/Transitions/JumpInTransition.vue';



const chatSearch = ref('');
const chatFilter = ref(ChatFilter.all);
const groupModalActive = ref(false);
const chatStore = useChatStore();

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


</script>

<template>
  <section class="h-full">

    <div class="px-4 mt-6 grid gap-3">
      <div class="flex items-center gap-2 justify-between ">
        <h3 class="text-lg font-bold">Chats</h3>
        <Dropdown icon="fa-ellipsis-vertical" rounded>
          <template #dropdown-items>
            <DropdownItem :on-click="toggleGroupModal" icon="fa-comments">New group</DropdownItem>
            <DropdownItem icon="fa-cog">Settings</DropdownItem>
            <DropdownItem icon="fa-lock">Privacy</DropdownItem>

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

    <Modal :modal-active="groupModalActive" @on-close="toggleGroupModal" title="Create a new group chat">
      <JumpInTransition>
        <span class="flex items-center gap-4" v-if="chatStore.state.loading">
          <Spinner type="spinner" />
          <p class="text-sm text-slate-400">Creating chat...</p>
        </span>
        <ChatForm v-else />
      </JumpInTransition>

    </Modal>


  </section>
</template>


<style scoped></style>
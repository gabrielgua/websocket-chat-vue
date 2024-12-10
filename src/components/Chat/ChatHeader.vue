<script setup lang="ts">
import { useChatStore } from '@/stores/chat.store';
import { computed } from 'vue';
import Avatar from '../Avatar.vue';
import ChatAvatar from './ChatAvatar.vue';
import JumpInTransition from '../Transitions/JumpInTransition.vue';
import Button from '../Button.vue';
import { UserStatus } from '@/types/user.type';
import SlideInTransition from '../Transitions/SlideInTransition.vue';
import { ChatType, type Chat } from '@/types/chat.type';
import Dropdown from '../Dropdown/Dropdown.vue';
import DropdownItem from '../Dropdown/DropdownItem.vue';

const { closeCurrent } = useChatStore();



const props = defineProps<{
  chat: Chat
}>();

const isGroup = computed(() => props.chat.type === ChatType.group);
const isPrivate = computed(() => props.chat.type === ChatType.private);


</script>


<template>
  <div class="flex items-center gap-4 p-4 bg-slate-800 rounded-lg shadow-2xl">
    <JumpInTransition>
      <Avatar v-if="isPrivate" :url="chat.receiver!.avatarUrl" :status="chat.receiver!.status" status-inverted-color />
      <ChatAvatar v-else :chat="chat" />

    </JumpInTransition>

    <div class="flex flex-col transition-all">


      <p class="font-bold">{{ chat.name }}</p>
      <SlideInTransition>
        <div v-if="isGroup && chat.users">
          <div class="flex items-center text-xs text-slate-400">
            <p>{{ chat.users.length }} members - </p>
            <span class="w-2 flex aspect-square rounded-full mx-1 bg-emerald-500"></span>
            <p>{{ chat.statusCount.online }} online</p>
          </div>
        </div>
        <p v-else-if="chat.receiver?.status === UserStatus.Online" class="text-xs text-slate-400">online</p>
        <p v-else class="text-xs text-slate-400">offline</p>
      </SlideInTransition>
    </div>

    <Dropdown class="ml-auto" variant="secondary-text" icon="fa-ellipsis-vertical" rounded>
      <template #dropdown-items>
        <DropdownItem icon="fa-file-lines">Details</DropdownItem>
        <DropdownItem icon="fa-user-group">Users</DropdownItem>
        <DropdownItem icon="fa-cog">Settings</DropdownItem>
        <DropdownItem :on-click="closeCurrent" icon="fa-xmark">Close chat</DropdownItem>
      </template>
    </Dropdown>
  </div>
</template>


<style scoped></style>

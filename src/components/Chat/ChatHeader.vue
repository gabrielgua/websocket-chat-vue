<script setup lang="ts">
import { useChatStore } from '@/stores/chat.store';
import { computed } from 'vue';
import Avatar from '../Avatar.vue';
import ChatAvatar from './ChatAvatar.vue';
import JumpInTransition from '../Transitions/JumpInTransition.vue';
import Button from '../Button.vue';
import { UserStatus } from '@/types/user.type';
import SlideInTransition from '../Transitions/SlideInTransition.vue';

const chatStore = useChatStore();
const chat = computed(() => chatStore.current);

const isGroup = computed(() => chatStore.isGroup());
const isPrivate = computed(() => chatStore.isPrivate());


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

    <Button class="ms-auto" icon="fa-gear" variant="secondary-text" tooltip="Settings" tooltip-pos="left" rounded />
  </div>
</template>


<style scoped></style>

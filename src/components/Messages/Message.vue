<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { format } from 'date-fns';
import { computed, onMounted, ref } from 'vue';
import Avatar from '../Avatar.vue';
import type { User } from '@/types/user.type';

const props = defineProps<{
  sender: User,
  timestamp: Date,
  showSenderUsername: boolean,
  showAvatar: boolean,
}>();

const authStore = useAuthStore();

const isSender = computed(() => props.sender.id === authStore.authentication.userId);

const formatMessageTimestamp = (timestamp: Date) => {
  return format(timestamp, "HH:mm");
}

const normalStyles = 'bg-slate-900';
const senderStyles = 'justify-self-end text-end bg-sky-600';


</script>
<template>
  <div class="flex gap-3" :class="[{ 'mt-8': showAvatar }, { 'flex-row-reverse': isSender }]">

    <div class="min-w-8">
      <Avatar :url="sender.avatarUrl" v-if="showAvatar" no-status size="small" />
    </div>
    <div class="relative grid max-w-max px-2.5 py-1.5 rounded-xl text-[15px] mb-0.5"
      :class="[isSender ? senderStyles : normalStyles, { 'rounded-tr-none': isSender && showAvatar }, { 'rounded-tl-none': !isSender && showAvatar }]">
      <p v-if="showSenderUsername && showAvatar && !isSender" class="text-xs font-semibold mb-2 text-slate-400"
        :class="sender.color">
        @{{ sender.username }}
      </p>
      <div class="flex gap-2">
        <slot />
        <div class="self-end text-xs -mb-0.5">
          <span class="opacity-70">{{ formatMessageTimestamp(timestamp) }}</span>
          <!-- <fa-icon icon="fa-check" class="text-blue-800 ml-1" v-if="false" /> -->
        </div>
      </div>

      <div v-if="showAvatar" class="message-triangle absolute"
        :class="[isSender ? 'message-triangle-sender ' : 'message-triangle-normal']">
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-triangle {
  width: 0;
  height: 0;

  place-self: start;

  border: 10px solid transparent;
  background-color: transparent;
  border-top-color: transparent;
}

.message-triangle-sender {
  right: -10px;
  border-top-color: #0284c7;
}

.message-triangle-normal {
  left: -10px;
  border-top-color: #0f172a;
}
</style>

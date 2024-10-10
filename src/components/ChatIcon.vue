<script setup lang="ts">
import { ChatType, type Chat } from '@/types/chat.type';
import { UserStatus } from '@/types/user.type';


defineProps<{
  chat: Chat,
  status?: boolean
}>();



function generateNameAbreviation(name: string) {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

function isPrivate(chat: Chat) {
  return chat.type === ChatType.private;
}

</script>

<template>
  <div class="relative min-w-12 grid place-items-center rounded-full aspect-square"
    :class="!isPrivate(chat) ? `bg-${chat.color}` : 'bg-transparent'">
    <img :src="chat.receiver.avatarUrl" v-if="chat.receiver" />
    <p class="font-bold chat-name " v-else>{{ generateNameAbreviation(chat.name) }}</p>

    <div :title="`Currently ${chat.receiver?.status}`" class="absolute top-0 right-1 grid place-items-center"
      v-if="status && isPrivate(chat)">
      <span :class="[chat.receiver?.status === UserStatus.Online ? 'bg-emerald-500' : 'bg-slate-600']"
        class="rounded-full w-2 aspect-square outline outline-4 outline-slate-800"></span>
    </div>
  </div>
</template>


<style scoped>
.chat-name {
  text-shadow: 0px 0px 10px rgba(0, 0, 0, .5);
}
</style>
<script setup lang="ts">
import type { Chat } from '@/types/chat.type';

defineProps<{
  chat: Chat
}>();


function generateNameAbreviation(name: string) {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}


</script>

<template>
  <div class="transition-all relative min-w-12 grid place-items-center rounded-full aspect-square bg-slate-600/50">
    <p class="font-bold">{{ generateNameAbreviation(chat.name) }}</p>
  </div>
</template>


<style scoped></style>
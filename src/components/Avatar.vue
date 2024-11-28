<script setup lang="ts">
import { UserStatus } from '@/types/user.type';
import { computed } from 'vue';

const props = defineProps<{
  url: string,
  status: UserStatus
}>();

const online = computed(() => props.status === UserStatus.Online);

</script>
<template>
  <div class="relative transition-all">
    <img class="min-w-12 min-h-12" :src="url" alt="Profile pic">

    <span class="w-2 h-2 rounded-full ring ring-slate-900 absolute right-1 top-0.5"
      :class="[online ? 'bg-emerald-500' : 'bg-slate-600']"></span>
  </div>
</template>

<style scoped></style>
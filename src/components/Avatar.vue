<script setup lang="ts">
import { UserStatus } from '@/types/user.type';
import { computed } from 'vue';
import JumpInTransition from './Transitions/JumpInTransition.vue';

const props = defineProps<{
  url: string,
  status?: UserStatus,
  statusInvertedColor?: boolean,
  noStatus?: boolean
}>();

const online = computed(() => props.status === UserStatus.Online);

</script>
<template>
  <div class="relative transition-all">
    <img class="min-w-12 min-h-12" :src="url" alt="Profile pic">

    <div v-if="!noStatus" class="rounded-full w-4 h-4 grid place-items-center absolute -right-0 -top-0.5"
      :class="[statusInvertedColor ? 'bg-slate-800' : 'bg-slate-900 ']">
      <JumpInTransition name="jump-in" mode="out-in">
        <span v-if="online" class="w-2 h-2 rounded-full bg-emerald-500" />
        <span v-else class="w-2 h-2 rounded-full bg-slate-600" />
      </JumpInTransition>
    </div>
  </div>
</template>

<style scoped></style>
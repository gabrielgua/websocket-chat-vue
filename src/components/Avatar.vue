<script setup lang="ts">
import { UserStatus } from '@/types/user.type';
import { computed } from 'vue';
import JumpInTransition from './Transitions/JumpInTransition.vue';

const props = withDefaults(defineProps<{
  url: string,
  status?: UserStatus,
  statusInvertedColor?: boolean,
  noStatus?: boolean,
  size?: 'small' | 'normal'
}>(), {
  size: 'normal'
})

const online = computed(() => props.status === UserStatus.Online);

const sizes = new Map<string, string>([
  ['small', 'w-8 h-8 min-w-8'],
  ['normal', 'w-12 h-12 min-w-12'],
])

</script>
<template>
  <div class="relative transition-all">
    <img :class="sizes.get(size)" class="rounded-full" :src="url" alt="Profile pic">

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
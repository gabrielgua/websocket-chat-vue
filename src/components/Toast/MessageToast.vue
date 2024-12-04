<script setup lang="ts">
import Avatar from '../Avatar.vue';
import Button from '../Button.vue';

defineProps<{
  title: string;
  description: string;
  avatarUrl: string;
  remainingSeconds: number;
}>()
</script>

<template>
  <div class="relative w-[350px] transition-all bg-slate-900 p-3 pr-2 rounded-2xl text-sky-600">


    <div class="flex items-start gap-3 ">
      <Avatar :url="avatarUrl" no-status />

      <div class="grid gap-2">
        <p class="font-semibold text-sm mr-24">{{ title }}</p>
        <p v-if="description" class="text-xs opacity-70">
          {{ description }}
        </p>
      </div>

      <div class="absolute flex items-center gap-2 right-1 top-1">
        <div class="flex items-center -mt-0.5 text-[11px] gap-1 opacity-70">
          <fa-icon icon="fa-clock"></fa-icon>
          <p>{{ remainingSeconds }}s</p>
        </div>
        <Button :on-click="() => $emit('on-dismiss')" variant="primary-text" icon="fa-xmark" rounded />
      </div>

    </div>

  </div>
</template>



<style scoped></style>
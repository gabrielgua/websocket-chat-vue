<script setup lang="ts">
import Avatar from '../Avatar.vue';
import BaseToast from './BaseToast.vue';

defineProps<{
  title: string;
  description: string;
  avatarUrl: string;
  remainingSeconds: number;
}>()
</script>

<template>
  <BaseToast btn="primary-text" :remaining-seconds="remainingSeconds" styles="text-sky-600">
    <div class="flex gap-3 items-center">

      <Avatar :url="avatarUrl" no-status />
      <div class="grid gap-2">
        <p class="font-semibold text-sm mr-24">{{ title }}</p>
        <p v-if="description" class="text-xs opacity-70">
          {{ description }}
        </p>
      </div>
    </div>
  </BaseToast>
</template>



<style scoped></style>
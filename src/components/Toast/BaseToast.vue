<script setup lang="ts">
import type { ButtonVariantType } from '../Button.vue';
import Button from '../Button.vue';

export type Toast = {
  btn: ButtonVariantType,
  icon: string,
  styles: string;
}

defineProps<{
  styles?: string,
  btn?: ButtonVariantType,
  remainingSeconds: number;
}>();

const emit = defineEmits(['on-dismiss']);

</script>
<template>
  <div class="relative w-[350px] shadow-2xl transition-all bg-slate-900 p-3 pr-2 rounded-2xl" :class="styles">
    <slot />
    <div class="absolute flex items-center gap-2 right-1 top-1">
      <div class="flex items-center -mt-0.5 text-[11px] gap-1 opacity-70">
        <fa-icon icon="fa-clock"></fa-icon>
        <p>{{ remainingSeconds }}s</p>
      </div>
      <Button :on-click="() => $emit('on-dismiss')" :variant="btn" icon="fa-xmark" rounded />
    </div>

  </div>
</template>

<style scoped></style>
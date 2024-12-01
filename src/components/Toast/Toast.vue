<script setup lang="ts">
import { computed } from 'vue';
import Button from '../Button.vue';
import type { ToastVariant } from '@/stores/toast.store';


const props = defineProps<{
  variant?: ToastVariant,
  title: string,
  description?: string,
  remainingSeconds: number;
}>();


const emit = defineEmits(['on-dismiss'])

const remainingSeconds = computed(() => props.remainingSeconds);


const info = computed(() => props.variant === 'info');
const success = computed(() => props.variant === 'success');
const danger = computed(() => props.variant === 'danger');

const variants = [
  { name: 'info', styles: 'ring-sky-600/20 text-sky-400 shadow-sky-600/20' },
  { name: 'success', styles: 'ring-teal-400/20  text-teal-400 shadow-teal-600/20' },
  { name: 'danger', styles: 'ring-rose-300/20 text-rose-500 shadow-rose-400/20 ' },
]

const getVariantStyles = () => {
  if (!props.variant) return variants.find(variant => variant.name === 'info')?.styles;

  return variants.find(variant => variant.name === props.variant)?.styles;
}

</script>

<template>
  <div class="relative ring-1 w-[350px] transition-all bg-slate-900 p-4 pr-2 rounded-xl" :class="getVariantStyles()">

    <div class="flex items-start gap-3">
      <fa-icon v-if="info" icon="fa-solid fa-info-circle" />
      <fa-icon v-if="success" icon="fa-solid fa-check-circle" />
      <fa-icon v-if="danger" icon="fa-solid fa-xmark-circle" />

      <p class="font-semibold -mt-0.5 text-sm mr-12">{{ title }}</p>

      <div class="absolute flex items-center gap-2 right-2 top-2">
        <div class="flex items-center -mt-0.5 text-[11px] gap-1 opacity-70">
          <fa-icon icon="fa-clock"></fa-icon>
          <p>{{ remainingSeconds }}s</p>
        </div>
        <Button :on-click="() => $emit('on-dismiss')"
          :variant="props.variant ? success ? 'success-text' : danger ? 'danger-text' : 'primary-text' : 'primary-text'"
          rounded icon="fa-xmark" />
      </div>
    </div>
    <p v-if="description" class="text-xs mx-7 mt-3 opacity-70">
      {{ description }}
    </p>
  </div>
</template>

<style scoped></style>
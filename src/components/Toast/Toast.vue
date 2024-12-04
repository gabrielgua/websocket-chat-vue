<script setup lang="ts">
import type { ToastVariant } from '@/stores/toast.store';
import { computed, onMounted, ref } from 'vue';
import Button, { type ButtonVariantType } from '../Button.vue';
import Avatar from '../Avatar.vue';
type Toast = {
  btn: ButtonVariantType,
  icon: string,
  styles: string;
}

const props = defineProps<{
  variant?: ToastVariant,
  title: string,
  description?: string,
  remainingSeconds: number;
}>();

onMounted(() => {
  toast.value = variants.get(props.variant ? props.variant : 'info');
})

const toast = ref<Toast>();
const emit = defineEmits(['on-dismiss'])
const remainingSeconds = computed(() => props.remainingSeconds);


const variants: Map<string, Toast> = new Map([
  ['info', { btn: 'primary-text', icon: 'fa-info-circle', styles: 'text-sky-400' }],
  ['success', { btn: 'success-text', icon: 'fa-check-circle', styles: 'text-teal-400' }],
  ['danger', { btn: 'danger-text', icon: 'fa-xmark-circle', styles: 'text-rose-400' }],
]);

</script>

<template>
  <div class="relative w-[350px] transition-all bg-slate-900 p-3 pr-2 rounded-2xl" :class="toast?.styles">

    <div class="flex items-start gap-3">
      <fa-icon :icon="`fa-solid ${toast?.icon}`" />

      <p class="font-semibold  text-sm mr-12">{{ title }}</p>

      <div class="absolute flex items-center gap-2 right-1 top-1">
        <div class="flex items-center -mt-0.5 text-[11px] gap-1 opacity-70">
          <fa-icon icon="fa-clock"></fa-icon>
          <p>{{ remainingSeconds }}s</p>
        </div>
        <Button :on-click="() => $emit('on-dismiss')" :variant="toast?.btn" icon="fa-xmark" rounded />
      </div>
    </div>
    <p v-if="description" class="text-xs mx-7 mt-3 opacity-70">
      {{ description }}
    </p>
  </div>
</template>

<style scoped></style>
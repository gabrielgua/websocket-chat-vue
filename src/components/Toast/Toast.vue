<script setup lang="ts">
import type { ToastVariant } from '@/stores/toast.store';
import { assert } from 'console';
import { computed, onMounted, ref } from 'vue';
import type { Toast } from './BaseToast.vue';
import BaseToast from './BaseToast.vue';


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
const remainingSeconds = computed(() => props.remainingSeconds);


const variants: Map<string, Toast> = new Map([
  ['info', { btn: 'primary-text', icon: 'fa-info-circle', styles: 'text-sky-400' }],
  ['success', { btn: 'success-text', icon: 'fa-check-circle', styles: 'text-teal-400' }],
  ['danger', { btn: 'danger-text', icon: 'fa-xmark-circle', styles: 'text-rose-400' }],
]);

</script>

<template>
  <BaseToast :styles="toast?.styles" :btn="toast?.btn" :remaining-seconds="remainingSeconds">
    <div class="flex gap-3" :class="description ? 'items-start' : 'items-center'">
      <fa-icon v-if="toast?.icon" :icon="`${toast.icon}`" />
      <div>
        <p class="font-semibold text-sm mr-12">{{ title }}</p>
        <p v-if="description" class="text-xs mt-3 opacity-80">
          {{ description }}
        </p>
      </div>
    </div>
  </BaseToast>
</template>

<style scoped></style>
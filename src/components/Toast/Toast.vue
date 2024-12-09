<script setup lang="ts">
import type { ToastVariant } from '@/stores/toast.store';
import { computed, onMounted, ref } from 'vue';
import Avatar from '../Avatar.vue';
import Button, { type ButtonVariantType } from '../Button.vue';

type Toast = {
  btn: ButtonVariantType,
  icon: string,
  styles: string;
}

const props = defineProps<{
  variant?: ToastVariant,
  title: string,
  description?: string,
  remainingSeconds?: number;
  avatarUrl?: string;
}>();

onMounted(() => {
  console.log(!!props.variant, props.variant);
  toast.value = !!props.variant ? variants.get(props.variant) : variants.get('info');
  console.log(toast.value);

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
  <div class="relative w-[350px] shadow-2xl transition-all bg-slate-950 p-3 pr-2 rounded-2xl" :class="toast?.styles">
    <div class="flex gap-3" :class="description ? 'items-start' : 'items-center'">
      <Avatar v-if="avatarUrl" :url="avatarUrl" no-status />
      <fa-icon v-else-if="toast?.icon" :icon="`${toast.icon}`" />
      <div>
        <p class="font-semibold text-sm mr-12">{{ title }}</p>
        <p v-if="description" class="text-xs mt-3 opacity-80">
          {{ description }}
        </p>
      </div>
    </div>
    <div class="absolute flex items-center gap-2 right-1 top-1">
      <div class="flex items-center text-[11px] gap-1 opacity-70">
        <fa-icon icon="fa-clock" class="-mt-0.5" />
        <p>{{ remainingSeconds }}s</p>
      </div>
      <Button :on-click="() => $emit('on-dismiss')" :variant="toast?.btn" icon="fa-xmark" rounded />
    </div>
  </div>
</template>

<style scoped></style>
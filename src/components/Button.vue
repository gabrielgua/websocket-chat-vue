<script setup lang="ts">
import { ref } from 'vue';
import type { ToolTipPosition } from './Tooltip.vue';
import Tooltip from './Tooltip.vue';

export type ButtonVariantType =
  'primary' | 'primary-outlined' | 'primary-text' |
  'secondary' | 'secondary-outlined' | 'secondary-text' |
  'success' | 'success-outlined' | 'success-text' |
  'danger' | 'danger-outlined' | 'danger-text' |
  'link' | 'link-primary' | 'link-secondary' | 'link-success' | 'link-danger';

type ButtonVariant = {
  name: ButtonVariantType,
  styles: string
}

type ButtonProps = {
  onClick?: () => void,
  icon?: string,
  variant?: ButtonVariantType,
  rounded?: boolean
  submit?: boolean
  inverted?: boolean,
  tooltip?: string,
  tooltipPos?: ToolTipPosition,
  noPadding?: boolean,
  disabled?: boolean
}

const props = defineProps<ButtonProps>()

const variants: ButtonVariant[] = [
  { name: 'primary', styles: 'bg-sky-600 hover:bg-sky-700 transition-colors' },
  { name: 'secondary', styles: 'bg-slate-800 hover:bg-slate-700 transition-colors' },
  { name: 'success', styles: 'bg-teal-500 hover:bg-teal-600 transition-colors' },
  { name: 'danger', styles: 'bg-rose-500 hover:bg-rose-700 transition-colors' },

  { name: 'primary-outlined', styles: 'ring-1 ring-sky-600 hover:ring transition-all active:transition-none ' },
  { name: 'secondary-outlined', styles: 'ring-1 ring-slate-800 hover:ring transition-all active:transition-none' },
  { name: 'success-outlined', styles: 'ring-1 ring-teal-500 hover:ring transition-all active:transition-none' },
  { name: 'danger-outlined', styles: 'ring-1 ring-rose-500 hover:ring transition-all active:transition-none' },

  { name: 'primary-text', styles: 'text-sky-600 hover:bg-sky-600/20 transition-colors' },
  { name: 'secondary-text', styles: 'text-slate-300 hover:bg-slate-600/30 transition-colors' },
  { name: 'success-text', styles: 'text-teal-500 hover:bg-teal-600/30 transition-colors' },
  { name: 'danger-text', styles: 'text-rose-500 hover:bg-rose-500/40 transition-colors' },

  { name: 'link', styles: 'hover:underline' },
  { name: 'link-primary', styles: 'text-sky-600 hover:underline' },
  { name: 'link-secondary', styles: 'text-slate-300 hover:underline' },
  { name: 'link-success', styles: 'text-teal-300 hover:underline' },
  { name: 'link-danger', styles: 'text-rose-500 hover:underline' },
]

const handleClick = () => {
  showTooltip.value = false;

  if (props.onClick) {
    props.onClick();
  }

}

const getButtonVariant = () => {
  return variants.find(v => v.name === props.variant)?.styles;
}

const showTooltip = ref(false);

</script>

<template>
  <div class="relative grid place-items-center transition-all" @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    :class="[{ 'rounded-full': rounded }, { 'opacity-35 pointer-events-none': disabled }]">
    <button :disabled="disabled" :type="submit ? 'submit' : 'button'" @click="handleClick"
      class="flex items-center justify-center text-sm gap-2 active:scale-95"
      :class="getButtonVariant(), [rounded ? 'rounded-full w-9 aspect-square ' : 'rounded-xl px-4 w-full'], { 'flex-row-reverse': inverted }, [noPadding ? '' : 'p-2']">
      <slot />
      <fa-icon v-if="icon" class="text-sm" :icon="`fa-solid ${icon}`" />
    </button>

    <Tooltip v-if="tooltip" :title="tooltip" :show="showTooltip" :position="tooltipPos" />

  </div>
</template>


<style scoped></style>
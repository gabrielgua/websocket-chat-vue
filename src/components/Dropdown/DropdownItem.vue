<script setup lang="ts">
import Button, { type ButtonVariantType } from '../Button.vue';

const props = defineProps<{
  icon?: string,
  variant?: ButtonVariantType
  onClick?: () => void
}>()

</script>

<template>
  <div>
    <button @click="onClick"
      class="text-slate-300 hover:bg-slate-600/30 text-sm transition-colors p-2  rounded-xl w-full flex items-center gap-2">
      <div class="w-5">
        <fa-icon class="text-sm" :icon="icon" />
      </div>
      <slot />
    </button>
  </div>
</template>


<style scoped></style>
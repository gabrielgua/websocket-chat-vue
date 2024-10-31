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
    <Button :on-click="onClick" :variant="variant ? variant : 'secondary-text'" class="*:w-[100%] *:justify-end"
      :icon="icon" inverted>
      <slot />
    </Button>
  </div>
</template>


<style scoped></style>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button, { type ButtonVariantType } from '../Button.vue';
import type { ToolTipPosition } from '../Tooltip.vue';

type DropdownPosition = 'start' | 'center' | 'end'

const props = defineProps<{
  inverted?: boolean,
  variant?: ButtonVariantType,
  position?: DropdownPosition,
  icon?: string,
  rounded?: boolean,
  tooltip?: string,
  tooltipPos?: ToolTipPosition
}>()

onMounted(() => {
  position.value = positions.get(props.position ? props.position : 'end')!;
});

const showDropdown = ref(false);
const position = ref('');


const positions: Map<DropdownPosition, string> = new Map([
  ['start', 'place-self-start'],
  ['center', 'place-self-center'],
  ['end', 'place-self-end'],
])

const clickOutside = () => {
  if (showDropdown) showDropdown.value = false;
}


</script>


<template>
  <div class="relative grid">
    <Button :on-click="() => showDropdown = !showDropdown" :variant="variant ? variant : 'secondary'"
      :icon="icon ? icon : showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'" :inverted="inverted" :rounded="rounded"
      :tooltip="tooltip" :tooltip-pos="tooltipPos">
      <slot />
    </Button>
    <Transition name="dropdown-menu">
      <div v-if="showDropdown" v-click-outside="clickOutside" @click="clickOutside"
        class="absolute *:w-[100%] flex flex-col items-start border border-slate-800/60 shadow min-w-40 w-max top-[100%] mt-2 z-20 bg-slate-900 p-2 rounded-xl"
        :class="position">
        <slot name="dropdown-items" />
      </div>
    </Transition>
  </div>
</template>


<style scoped>
.dropdown-menu-enter-active,
.dropdown-menu-leave-active {
  transition: all 0.125s ease;
}

.dropdown-menu-enter-from,
.dropdown-menu-leave-to {
  opacity: 0;
  scale: .85;
  transform: translateY(-1rem);
}
</style>
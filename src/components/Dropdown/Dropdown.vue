<script setup lang="ts">
import { ref } from 'vue';
import Button, { type ButtonVariantType } from '../Button.vue';

type DropdownPosition = 'start' | 'center' | 'end'
type DropdownVariant = {
  name: DropdownPosition,
  class: string,
}

const props = defineProps<{
  inverted?: boolean,
  variant?: ButtonVariantType,
  position?: DropdownPosition,
  icon?: string,
  rounded?: boolean
}>()

const showDropdown = ref(false);

const clickOutside = () => {
  if (showDropdown) showDropdown.value = false;
}

const positions: DropdownVariant[] = [
  { name: 'start', class: 'place-self-start' },
  { name: 'center', class: 'place-self-center' },
  { name: 'end', class: 'place-self-end' },
]

const getPosition = () => {
  if (!props.position) return 'place-self-end'

  return positions.find(p => p.name === props.position)?.class
}
</script>


<template>
  <div class="relative grid">
    <Button :on-click="() => showDropdown = !showDropdown" :variant="variant ? variant : 'secondary'"
      :icon="icon ? icon : showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'" :inverted="inverted" :rounded="rounded">
      <slot />
    </Button>
    <Transition name="dropdown-menu">
      <div v-if="showDropdown" v-click-outside="clickOutside" @click="clickOutside"
        class="absolute *:w-[100%] flex flex-col items-start border border-slate-800/60 shadow min-w-40 w-max top-[100%] mt-2 z-20 bg-slate-900 p-2 rounded-xl"
        :class="getPosition()">
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
  scale: .9;
  transform: translateY(-1rem);
}
</style>
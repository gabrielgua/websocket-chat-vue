<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string,
  position?: ToolTipPosition,
  show: boolean
}>()

export type ToolTipPosition =
  'top' | 'top-start' | 'top-end' |
  'bottom' | 'bottom-start' | 'bottom-end' |
  'left' | 'right';

type ToolTipVariant = {
  name: ToolTipPosition
  class: string
}

const tooltipVariants: ToolTipVariant[] = [
  { name: 'top', class: 'tooltip-wrapper-top' },
  { name: 'top-start', class: 'tooltip-wrapper-top place-self-start' },
  { name: 'top-end', class: 'tooltip-wrapper-top place-self-end' },


  { name: 'bottom', class: 'tooltip-wrapper-bottom' },
  { name: 'bottom-start', class: 'tooltip-wrapper-bottom place-self-start' },
  { name: 'bottom-end', class: 'tooltip-wrapper-bottom place-self-end' },


  { name: 'left', class: 'tooltip-wrapper-left' },
  { name: 'right', class: 'tooltip-wrapper-right' },
]

const getTooltipPos = () => {
  console.log(props.position);
  if (!props.position) {
    return 'tooltip-wrapper-top';
  }

  return tooltipVariants.find(t => t.name === props.position)?.class;
}


</script>

<template>
  <Transition name="tooltip">
    <div v-if="show" class="tooltip-wrapper " :class="getTooltipPos()">
      <span class=" bg-white text-black px-2 py-1 rounded-xl text-sm">
        {{ props.title }}
      </span>
    </div>
  </Transition>
</template>


<style scoped></style>
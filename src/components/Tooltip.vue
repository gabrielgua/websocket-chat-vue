<script setup lang="ts">

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
  { name: 'top', class: 'tooltip-top' },
  { name: 'top-start', class: 'tooltip-top tooltip-top-start' },
  { name: 'top-end', class: 'tooltip-top tooltip-top-end' },

  { name: 'bottom', class: 'tooltip-bottom' },
  { name: 'bottom-start', class: 'tooltip-bottom tooltip-bottom-start' },
  { name: 'bottom-end', class: 'tooltip-bottom tooltip-bottom-end' },

  { name: 'left', class: 'tooltip-left' },
  { name: 'right', class: 'tooltip-right' },
]

const getTooltipPos = () => {
  if (!props.position) {
    return 'tooltip-top';
  }

  return tooltipVariants.find(t => t.name === props.position)?.class;
}


</script>

<template>
  <Transition name="tooltip">
    <div v-if="show" class="absolute tooltip" :class="getTooltipPos()">
      <div class="relative bg-white text-black px-2 py-1 rounded-xl text-sm grid">
        <p class="text-nowrap">{{ props.title }}</p>
        <div class="triangle absolute"></div>
      </div>
    </div>
  </Transition>
</template>


<style scoped>
.triangle {
  --triangle-margin: .5rem;
  width: 0;
  height: 0;

  background-color: transparent;
  border-top: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  place-self: center;
}

.tooltip {
  --margin: .75rem;
  z-index: 10;
  position: absolute;
}

.tooltip-top {
  margin-block-end: var(--margin);
  bottom: 100%;
}

.tooltip-top .triangle {
  bottom: -15px;
  border-top-color: white;
}


.tooltip-top-start,
.tooltip-bottom-start {
  place-self: start;
}

.tooltip-top-end,
.tooltip-bottom-end {
  place-self: end;
}

.tooltip-top-start .triangle,
.tooltip-bottom-start .triangle {
  left: var(--triangle-margin)
}

.tooltip-top-end .triangle,
.tooltip-bottom-end .triangle {
  right: var(--triangle-margin);
}


.tooltip-bottom {
  margin-block-start: var(--margin);
  top: 100%;
}

.tooltip-bottom .triangle {
  top: -15px;
  border-bottom-color: white;
}

.tooltip-right {
  margin-inline-start: var(--margin);
  left: 100%;
}

.tooltip-right .triangle {
  left: -15px;
  border-right-color: white;
}

.tooltip-left {
  margin-inline-end: var(--margin);
  right: 100%;
}

.tooltip-left .triangle {
  right: -15px;
  border-left-color: white;
}

.tooltip-enter-active {
  transition: all 125ms ease 500ms;
}

.tooltip-leave-active {
  transition: all 125ms ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  scale: .9;
}
</style>
<script setup lang="ts">

</script>

<template>
  <Transition name="jump-in" mode="out-in">
    <slot />
  </Transition>
</template>

<style scoped>
.jump-in-enter-active,
.jump-in-leave-active {
  transition: all 100ms ease-out;
}

.jump-in-enter-from,
.jump-in-leave-to {
  opacity: 0;
  scale: .7;
}
</style>
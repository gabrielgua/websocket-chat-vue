<script setup lang="ts">

</script>
<template>
  <Transition name="slide-in" mode="out-in">
    <slot />
  </Transition>
</template>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 100ms ease-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  scale: .7;
}

.slide-in-enter-from {
  transform: translateX(-35px);
}

.slide-in-leave-to {
  transform: translateX(35px);
}
</style>
<template>
  <Transition name="fade" mode="out-in">
    <slot />
  </Transition>

</template>
<style scoped>
.fade-enter-active {
  transition: all 150ms ease;
}

.fade-leave-active {
  transition: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
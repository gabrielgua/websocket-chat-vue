<script setup lang="ts">
import { watch } from 'vue';
import { useUnreadStore } from './stores/unread.store';

const store = useUnreadStore();

watch(() => store.count, (newCount) => {
  document.title = newCount > 0
    ? `(${newCount}) WebSocket Chat`
    : 'WebSocket Chat'
}, { immediate: true })

</script>

<template>
  <RouterView></RouterView>
</template>

<style global>
:root {
  color-scheme: dark;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif
}

body {
  --container-outline-clr: #222831;
  --df-border-clr: #222831;

  background-color: var(--container-outline-clr);

}

.button {
  border: none;
  cursor: pointer;
  background-color: transparent;
  transition: all ease-out 150ms;
}

.button:hover {
  transform: translateY(-0.125rem);
}
</style>

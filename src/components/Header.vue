<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useStompStore } from '@/stores/stomp.store';
import { onMounted } from 'vue';
const authStore = useAuthStore();
const stompStore = useStompStore();

onMounted(() => {
  stompStore.connect();
  authStore.checkAuthentication()
})

emitter.on('connected', () => {
  stompStore.send('/app/user.connectUser', { id: authStore.authentication.userId });
});

emitter.on('disconnected', () => {
  stompStore.send('/app/user.disconnectUser', { id: authStore.authentication.userId })
});

window.addEventListener('beforeunload', () => {
  stompStore.send('/app/user.disconnectUser', { id: authStore.authentication.userId })
})

</script>
<template>
  <header class="header-container bg-slate-900 mx-auto col-span-3 p-4 flex items-center gap-4">
    <h1 class="font-bold text-3xl">WebSocket Chat</h1>
    <fa-icon class="text-2xl" icon="fa-solid fa-comments" />

    <div class="ms-auto flex items-center gap-4">
      <p class="text-sm">Hello, {{ authStore.authentication.username }}</p>
      <button @click="authStore.logout" class="hover:*:text-rose-400 ">
        <fa-icon class="text-slate-500 block transition-all" icon="fa-solid fa-right-from-bracket" />
      </button>
    </div>
  </header>
</template>


<style scoped>
.header-container {
  --container-width: 1500px;

  width: min(var(--container-width), 100%);
}
</style>

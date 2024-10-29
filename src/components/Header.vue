<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useStompStore } from '@/stores/stomp.store';
import { onMounted } from 'vue';
import Button from './Button.vue';
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
    <fa-icon class="text-2xl text-sky-600" icon="fa-solid fa-comments" />

    <div class="ms-auto flex items-center gap-2">
      <img class="w-6" :src="authStore.authentication.avatarUrl" :alt="authStore.authentication.userId.toString()">
      <p class="text-sm me-2">{{ authStore.authentication.username }}</p>
      <Button :on-click="authStore.logout" icon="fa-right-from-bracket" variant="danger-text" rounded tooltip="Logout"
        tooltip-pos="bottom-end"></Button>
    </div>
  </header>
</template>


<style scoped>
.header-container {
  --container-width: 1500px;

  width: min(var(--container-width), 100%);
}
</style>

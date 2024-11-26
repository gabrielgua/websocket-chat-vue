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
  <header class="max-w-max flex items-center p-4 gap-4">
    <h1 class="font-bold text-3xl">WebSocket Chat</h1>
    <fa-icon class="text-2xl text-sky-600" icon="fa-solid fa-comments" />
  </header>
</template>


<style scoped></style>

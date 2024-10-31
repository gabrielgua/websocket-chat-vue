<script setup lang="ts">
import { emitter } from '@/services/mitt';
import { useAuthStore } from '@/stores/auth.store';
import { useStompStore } from '@/stores/stomp.store';
import { onMounted } from 'vue';
import Dropdown from './Dropdown/Dropdown.vue';
import DropdownItem from './Dropdown/DropdownItem.vue';
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

    <Dropdown class="ms-auto" variant="secondary-text" chevronIcon inverted>
      <div class="flex items-center">
        <p class="text-sm me-2">{{ authStore.authentication.username }}</p>
        <img class="w-5" :src="authStore.authentication.avatarUrl" :alt="authStore.authentication.userId.toString()">
      </div>

      <template #dropdown-items>
        <DropdownItem icon="fa-user">Profile</DropdownItem>
        <DropdownItem icon="fa-gear">Settings</DropdownItem>
        <DropdownItem :on-click="authStore.logout" variant="danger-text" icon="fa-right-from-bracket">
          Logout
        </DropdownItem>
      </template>
    </Dropdown>
  </header>
</template>


<style scoped>
.header-container {
  --container-width: 1500px;

  width: min(var(--container-width), 100%);
}
</style>

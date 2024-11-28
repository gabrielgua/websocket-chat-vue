<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import Button from '@/components/Button.vue';
import { useFriendStore } from '@/stores/friend.store';
import { useUserStore } from '@/stores/user.store';
import type { User } from '@/types/user.type';

const friendStore = useFriendStore();
const userStore = useUserStore();



const isOnline = (user: User) => {
  return userStore.isOnline(user)
}



</script>
<template>
  <section>
    <ul class="grid">
      <li v-for="user in friendStore.friends" :key="user.id"
        class="flex items-center gap-3 p-4 border-b border-b-slate-800 last:border-none">
        <Avatar :status="user.status" :url="user.avatarUrl" />
        <div>
          <p class="text-sm font-semibold">{{ user.username }}</p>
          <p class="text-xs text-slate-400">{{ isOnline(user) ? 'Online' : 'Offline' }}</p>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <Button icon="fa-comment" variant="primary" rounded tooltip="Chat" />
          <Button icon="fa-user-xmark" variant="secondary" rounded tooltip="Remove friend" />
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
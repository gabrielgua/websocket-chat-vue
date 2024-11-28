<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import Button from '@/components/Button.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import JumpInTransition from '@/components/Transitions/JumpInTransition.vue';
import { emitter } from '@/services/mitt';
import { useAsideStore } from '@/stores/aside.store';
import { useFriendStore } from '@/stores/friend.store';
import { useUserStore } from '@/stores/user.store';
import type { User } from '@/types/user.type';

const friendStore = useFriendStore();
const asideStore = useAsideStore();
const userStore = useUserStore();

emitter.on('connectionNotification', (body) => {
  friendStore.updateFriendStatus(JSON.parse(body));
})

const isOnline = (user: User) => {
  return userStore.isOnline(user)
}

const goToChat = (user: User) => {
  asideStore.goToUserChat(user);
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

          <JumpInTransition>
            <p v-if="isOnline(user)" class="text-xs text-slate-400">Online</p>
            <p v-else class="text-xs text-slate-400">Offline</p>
          </JumpInTransition>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <Button :on-click="() => goToChat(user)" icon="fa-comment" variant="primary" rounded tooltip="Chat" />

          <Dropdown icon="fa-ellipsis-vertical" rounded variant="secondary">
            <template #dropdown-items>
              <DropdownItem icon="fa-user">Profile</DropdownItem>
              <DropdownItem icon="fa-user-xmark" variant="danger-text">Remove friend</DropdownItem>
            </template>
          </Dropdown>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
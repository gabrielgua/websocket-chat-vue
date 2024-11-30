<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import Button from '@/components/Button.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import JumpInTransition from '@/components/Transitions/JumpInTransition.vue';
import { emitter } from '@/services/mitt';
import { useAsideStore } from '@/stores/aside.store';
import { useFriendStore } from '@/stores/friend.store';
import { UserStatus, type User } from '@/types/user.type';
import { computed } from 'vue';

const friendStore = useFriendStore();
const asideStore = useAsideStore();

const friends = computed(() => sortFriendList())

emitter.on('connectionNotification', (body) => {
  friendStore.updateFriendStatus(JSON.parse(body));
})

const isOnline = (user: User) => {
  return user.status === UserStatus.Online;
}

const goToChat = (user: User) => {
  asideStore.goToUserChat(user);
}

const sortFriendList = () => {
  return friendStore.friends.sort((a, b) => Number(isOnline(b)) - Number(isOnline(a)))
}



</script>
<template>
  <section>
    <TransitionGroup name="friend-list" tag="ul" class="grid mt-6">
      <li v-for="user in friends" :key="user.id"
        class="transition-all flex items-center gap-3 p-4 hover:bg-slate-800/50">
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
    </TransitionGroup>

  </section>
</template>

<style scoped>
.friend-list-move,
.friend-list-enter-active,
.friend-list-leave-active {
  transition: all 250ms ease;
}

.friend-list-enter-from,
.friend-list-leave-to {
  opacity: 0;
  scale: .95;
  transform: translateX(-30px);
}

.friend-list-leave-active {
  position: absolute;
}
</style>
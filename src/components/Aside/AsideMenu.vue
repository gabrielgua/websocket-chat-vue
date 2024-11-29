<script setup lang="ts">
import { useAsideStore, type AsideType } from '@/stores/aside.store';
import { useAuthStore } from '@/stores/auth.store';
import Button from '../Button.vue';
import JumpInTransition from '../Transitions/JumpInTransition.vue';

const authStore = useAuthStore();
const asideStore = useAsideStore();


const isCurrent = (type: AsideType) => {
  return asideStore.currentMenu.type === type;
}

const changeCurrent = (type: AsideType) => {
  asideStore.changeMenu(type);
}

</script>

<template>
  <div class="p-4 bg-slate-800 shadow-lg flex flex-col justify-between shadow-slate-900 z-10">
    <ul class="flex flex-col gap-5">
      <li>
        <Button :on-click="() => changeCurrent('profile')" :class="{ 'ring ring-slate-200/30': isCurrent('profile') }"
          variant="secondary" rounded tooltip="Profile" tooltip-pos="right" no-padding>
          <img :src="authStore.authentication.avatarUrl" alt="Profile picture">
        </Button>
      </li>
      <hr class="border-slate-600 rounded">
      <li v-for="menu in asideStore.menus" :key="menu.name" class="relative">
        <Button :icon="menu.icon" :on-click="() => changeCurrent(menu.type)"
          :variant="isCurrent(menu.type) ? 'primary' : 'secondary-text'" rounded :tooltip="menu.name"
          tooltip-pos="right" />

        <JumpInTransition>
          <span v-if="menu.notification"
            class="w-3 h-3 ring ring-slate-800 bg-sky-600 absolute right-0.5 top-0.5 rounded-full">
          </span>

        </JumpInTransition>
      </li>

    </ul>
    <ul class="flex flex-col gap-5 mt-auto">
      <li>
        <Button icon="fa-info" variant="secondary-text" rounded tooltip="About" tooltip-pos="right" />
      </li>
      <li>
        <a href="https://github.com/gabrielgua/websocket-chat-vue" target="_blank">
          <Button icon="fa-brands fa-github" variant="secondary-text" rounded tooltip="Repository"
            tooltip-pos="right" />
        </a>

      </li>
    </ul>
    <ul class="flex flex-col gap-5">
      <hr class="border-slate-600 rounded mt-4">
      <li>
        <Button :on-click="authStore.logout" icon="fa-right-from-bracket" variant="danger" rounded tooltip="Logout"
          tooltip-pos="right" />
      </li>
    </ul>
  </div>
</template>


<style scoped></style>
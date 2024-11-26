<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import Button from './Button.vue';
import Dropdown from './Dropdown/Dropdown.vue';
import DropdownItem from './Dropdown/DropdownItem.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="m-4 ml-0">
    <ul class="flex flex-col gap-3">
      <li>
        <Dropdown rounded icon="no">
          <img :src="authStore.authentication.avatarUrl" alt="profile pic">

          <template #dropdown-items>
            <div
              class="text-sm text-slate-300 flex items-center px-3 p-2 mb-2 gap-3 justify-between rounded-xl bg-slate-800">
              <img class="w-6" :src="authStore.authentication.avatarUrl" alt="profile pic">
              {{ authStore.authentication.username }}
            </div>
            <DropdownItem icon="fa-user">Profile</DropdownItem>
            <DropdownItem icon="fa-bell">Notifications</DropdownItem>
            <DropdownItem icon="fa-cog">Settings</DropdownItem>
            <DropdownItem icon="fa-right-from-bracket" variant="danger-text" :on-click="authStore.logout">
              Logout
            </DropdownItem>

          </template>
        </Dropdown>
      </li>
      <li>
        <Button icon="fa-magnifying-glass" variant="primary" rounded />
      </li>
      <li>
        <Button icon="fa-cog" variant="secondary" rounded />
      </li>
      <li>
        <Button icon="fa-right-from-bracket" variant="danger" rounded />
      </li>
    </ul>
  </div>
</template>


<style scoped></style>
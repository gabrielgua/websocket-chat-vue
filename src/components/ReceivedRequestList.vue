<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import Button from './Button.vue';

const authStore = useAuthStore();
</script>
<template>
  <div>
    <ul class="px-4 divide-y divide-slate-800  overflow-y-auto">
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Usuario gamer da Silva</p>
            <p class="text-slate-500 text-xs">@usuariosilva.gamer</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500"></fa-icon>
            <p class="text-xs">received 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Deny" />
          <Button rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Usuario gamer da Silva</p>
            <p class="text-slate-500 text-xs">@usuariosilva.gamer</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500"></fa-icon>
            <p class="text-xs">received 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Deny" />
          <Button rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Usuario gamer da Silva</p>
            <p class="text-slate-500 text-xs">@usuariosilva.gamer</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500"></fa-icon>
            <p class="text-xs">received 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Deny" />
          <Button rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Usuario gamer da Silva</p>
            <p class="text-slate-500 text-xs">@usuariosilva.gamer</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500"></fa-icon>
            <p class="text-xs">received 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Deny" />
          <Button rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Usuario gamer da Silva</p>
            <p class="text-slate-500 text-xs">@usuariosilva.gamer</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500"></fa-icon>
            <p class="text-xs">received 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Deny" />
          <Button rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Usuario gamer da Silva</p>
            <p class="text-slate-500 text-xs">@usuariosilva.gamer</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500"></fa-icon>
            <p class="text-xs">received 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Deny" />
          <Button rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped></style>
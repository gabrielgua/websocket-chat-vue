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
            <p class="font-semibold text-sm">Gabriel Guaitanele Niszczak </p>
            <p class="text-slate-500 text-xs">@gabrielgua</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
            <p class="text-xs">PENDING</p>
          </div>
          <span class="text-slate-500">-</span>
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500" />
            <p class="text-xs">sent 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Cancel" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Gabriel Guaitanele Niszczak </p>
            <p class="text-slate-500 text-xs">@gabrielgua</p>
          </div>
        </div>
        <!-- <hr class="border-slate-800"> -->
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
            <p class="text-xs">PENDING</p>
          </div>
          <span class="text-slate-500">-</span>
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500" />
            <p class="text-xs">sent 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Cancel" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Gabriel Guaitanele Niszczak </p>
            <p class="text-slate-500 text-xs">@gabrielgua</p>
          </div>
        </div>
        <!-- <hr class="border-slate-800"> -->
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
            <p class="text-xs">PENDING</p>
          </div>
          <span class="text-slate-500">-</span>
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500" />
            <p class="text-xs">sent 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Cancel" />
        </div>
      </li>
      <li class="flex flex-col py-4">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="authStore.authentication.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">Gabriel Guaitanele Niszczak </p>
            <p class="text-slate-500 text-xs">@gabrielgua</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
            <p class="text-xs">PENDING</p>
          </div>
          <span class="text-slate-500">-</span>
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500" />
            <p class="text-xs">sent 3 days ago.</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" tooltip="Cancel" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
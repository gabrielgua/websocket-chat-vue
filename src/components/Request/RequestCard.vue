<script setup lang="ts">
import { computed } from 'vue';
import type { RequestListType } from '../RequestList.vue';
import { displayFullTimestamp } from '@/utils/date';
import type { User } from '@/types/user.type';
import Button from '../Button.vue';


const props = defineProps<{
  user: User;
  createdAt: string;
  status: string;
  type: RequestListType;
}>();


const sent = computed(() => {
  return props.type === 'sent';
})

const received = computed(() => {
  return props.type === 'received';
})
</script>

<template>
  <div class="flex flex-col p-4">
    <div class="flex items-center gap-4">
      <img class="w-10" :src="user.avatarUrl" />
      <div>
        <p class="font-semibold text-sm">{{ user.name }} </p>
        <p class="text-slate-500 text-xs">@{{ user.username }}</p>
      </div>
    </div>
    <div class="flex gap-3 items-end text-xs">
      <div class="flex items-center gap-1">
        <fa-icon icon="fa-solid fa-clock" class="text-slate-500" />
        <p class="text-xs">{{ type }} {{ displayFullTimestamp(new Date(createdAt)) }}</p>
      </div>
      <span v-if="sent" class="text-slate-500">-</span>
      <div v-if="sent" class="flex items-center gap-1">
        <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
        <p class="text-xs">{{ status }}</p>
      </div>

      <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" :tooltip="sent ? 'Cancel' : 'Deny'" />
      <Button v-if="received" rounded variant="success" icon="fa-check" tooltip="Accept" />
    </div>
  </div>
</template>

<style scoped></style>
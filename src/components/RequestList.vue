<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import Button from './Button.vue';
import { computed } from 'vue';
import type { FriendRequest } from '@/types/friendRequest.type';
import { displayFullTimestamp } from '@/utils/date';

export type RequestListType = 'sent' | 'received';

const authStore = useAuthStore();

const sent = computed(() => {
  return props.type === 'sent';
})

const received = computed(() => {
  return props.type === 'received';
})

const props = defineProps<{
  requests: FriendRequest[],
  type: RequestListType
}>();

</script>

<template>
  <div>
    <div class="m-4">
      <!-- <h3 class="font-semibold text-slate-400">{{ title }}</h3> -->
      <p class="text-xs text-slate-600">
        {{ type === 'sent' ? 'Here are the requests that you send to users.' : 'Requests that were received.' }}
      </p>
    </div>

    <ul class="px-4 divide-y divide-slate-800">
      <li class="flex flex-col py-4" v-for="request in requests">
        <div class="flex items-center gap-4">
          <img class="w-10" :src="sent ? request.receiver?.avatarUrl : request.requester?.avatarUrl" />
          <div>
            <p class="font-semibold text-sm">{{ sent ? request.receiver?.name : request.requester?.name }} </p>
            <p class="text-slate-500 text-xs">@{{ sent ? request.receiver?.username : request.requester?.username }}</p>
          </div>
        </div>
        <div class="flex gap-3 items-end text-xs">
          <div class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-clock" class="text-slate-500" />
            <p class="text-xs">{{ type }} {{ displayFullTimestamp(request.createdAt) }}</p>
          </div>
          <span v-if="sent" class="text-slate-500">-</span>
          <div v-if="sent" class="flex items-center gap-1">
            <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
            <p class="text-xs">{{ request.status }}</p>
          </div>

          <Button class="ml-auto" rounded variant="secondary" icon="fa-trash" :tooltip="sent ? 'Cancel' : 'Deny'" />
          <Button v-if="received" rounded variant="success" icon="fa-check" tooltip="Accept" />
        </div>
      </li>
    </ul>

  </div>


</template>


<style scoped></style>
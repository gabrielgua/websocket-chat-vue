<script setup lang="ts">
import type { FriendRequest, FriendRequestId } from '@/types/friendRequest.type';
import RequestCard from './RequestCard.vue';

export type RequestListType = 'sent' | 'received';

const props = defineProps<{
  requests: FriendRequest[],
  type: RequestListType
}>();

const getRequestId = (id: FriendRequestId) => {
  return `${id.requesterId}, ${id.receiverId}`;
}

</script>

<template>
  <section>

    <div class="mx-4 mt-6 mb-2">
      <p class="font-semibold text-sm text-slate-400">
        {{ type === 'sent' ? 'Sent' : 'Received' }}
      </p>
    </div>
    <TransitionGroup class="overflow-y-auto relative h-[calc(100dvh-265px)]" tag="ul" name="request-list">

      <div v-if="!requests.length" class="px-4">
        <p class="text-xs text-slate-400">No {{ type }} requests.</p>
      </div>

      <li v-for="request in requests" :key="getRequestId(request.id)"
        class="border-b border-slate-800 last:border-none">
        <RequestCard :type="type" :user="request.receiver ? request.receiver : request.requester!"
          :status="request.status" :created-at="request.createdAt.toString()" />
      </li>
    </TransitionGroup>


  </section>
</template>


<style scoped>
.request-list-move,
.request-list-enter-active,
.request-list-leave-active {
  transition: all 250ms ease;
}

.request-list-enter-from,
.request-list-leave-to {
  opacity: 0;
  scale: .95;

}

.request-list-leave-active {
  position: absolute;
  width: 100%;

}


::-webkit-scrollbar {
  width: .25rem;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(2 132 199);
  border-radius: .25rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>
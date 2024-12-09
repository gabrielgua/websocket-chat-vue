<script setup lang="ts">
import Button from '@/components/Button.vue';
import { useRequestStatusStore } from '@/stores/request.status.store';
import { useRequestStore } from '@/stores/request.store';
import type { FriendRequest, FriendRequestId } from '@/types/friendRequest.type';
import RequestCard from './RequestCard.vue';

export type RequestListType = 'sent' | 'received';

const props = defineProps<{
  requests: FriendRequest[],
  type: RequestListType
}>();

const requestStore = useRequestStore();
const requestStatusStore = useRequestStatusStore();

const getRequestId = (id: FriendRequestId) => {
  return `${id.requesterId}, ${id.receiverId}`;
}

const refreshRequests = () => {
  props.type === 'sent' ? requestStore.fetchSent() : requestStore.fetchReceived();
}

</script>

<template>
  <section>
    <div class="mx-4 mt-6 mb-2  flex items-center justify-between ">
      <p class="font-semibold text-sm text-slate-400">
        {{ type === 'sent' ? 'Sent' : 'Received' }}
      </p>
      <Button v-if="requestStatusStore.state.error" :on-click="refreshRequests"
        :class="{ 'animate-spin': requestStore.state.loading }" icon="fa-refresh" variant="secondary-text"
        :disabled="requestStore.state.loading" rounded />
    </div>

    <TransitionGroup class="overflow-y-auto relative h-[calc(100dvh-265px)]" tag="ul" name="request-list"
      :class="{ 'opacity-30 pointer-events-none': requestStore.state.loading }">

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
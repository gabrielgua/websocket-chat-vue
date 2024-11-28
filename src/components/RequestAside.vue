<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RequestHeader from './Request/RequestHeader.vue';
import RequestList, { type RequestListType } from './RequestList.vue';
import Button from './Button.vue';
import { useRequestStore } from '@/stores/request.store';
import { emitter } from '@/services/mitt';
import type { FriendRequest } from '@/types/friendRequest.type';
import { useFriendStore } from '@/stores/friend.store';
import { request } from 'node_modules/axios/index.cjs';

const requestStore = useRequestStore();
const friendStore = useFriendStore();

onMounted(() => {
  requestStore.fetchSent();
  requestStore.fetchReceived();
  friendStore.fetchFriends();
})

const handleRequestReceived = (body: string) => {
  const request: FriendRequest = JSON.parse(body);

  requestStore.addReceived(request);
}

emitter.on('requestReceived', handleRequestReceived);


const currentList = computed(() => {
  if (requestStore.currentType === 'sent') return requestStore.sent;
  return requestStore.received;
})

const changeCurrentType = (type: RequestListType) => {
  requestStore.changeCurrentType(type);
}


</script>

<template>
  <section>
    <RequestHeader />
    <div class="flex items-center px-4 mt-4 gap-4 justify-center">
      <Button class="w-full" :on-click="() => changeCurrentType('sent')"
        :variant="requestStore.currentType === 'sent' ? 'primary' : 'secondary'" icon="fa-arrow-up" inverted>
        Sent
      </Button>
      <Button class="w-full" :on-click="() => changeCurrentType('received')"
        :variant="requestStore.currentType === 'received' ? 'primary' : 'secondary'" icon="fa-arrow-down" inverted>
        Received
      </Button>
    </div>

    <hr class="border-slate-800 my-4" />

    <RequestList :type="requestStore.currentType" :requests="currentList" />
  </section>

</template>


<style scoped></style>
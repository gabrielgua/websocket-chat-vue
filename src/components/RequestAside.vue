<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RequestHeader from './Request/RequestHeader.vue';
import RequestList, { type RequestListType } from './RequestList.vue';
import Button from './Button.vue';
import { useRequestStore } from '@/stores/request.store';
import { emitter } from '@/services/mitt';
import type { FriendRequest } from '@/types/friendRequest.type';

const requestStore = useRequestStore();


onMounted(() => {
  requestStore.fetchSent();
  requestStore.fetchReceived();
})

const handleRequestReceived = (body: string) => {
  const request: FriendRequest = JSON.parse(body);

  requestStore.addReceived(request);
}

emitter.on('requestReceived', handleRequestReceived);

const currentListType = ref<RequestListType>('received');
const changeCurrentList = (type: RequestListType) => {
  currentListType.value = type;
}

const currentList = computed(() => {
  if (currentListType.value === 'sent') return requestStore.sent;
  return requestStore.received;
})


</script>

<template>
  <section>
    <RequestHeader />
    <div class="flex items-center px-4 mt-4 gap-4 justify-center">
      <Button class="w-full" :on-click="() => changeCurrentList('sent')"
        :variant="currentListType === 'sent' ? 'primary' : 'secondary'" icon="fa-arrow-up" inverted>Sent</Button>
      <Button class="w-full" :on-click="() => changeCurrentList('received')"
        :variant="currentListType === 'received' ? 'primary' : 'secondary'" icon="fa-arrow-down"
        inverted>Received</Button>
    </div>
    <hr class="border-slate-800 my-4" />


    <RequestList :type="currentListType" :requests="currentList" />


  </section>

</template>


<style scoped></style>
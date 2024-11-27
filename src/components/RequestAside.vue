<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RequestHeader from './Request/RequestHeader.vue';
import RequestList, { type RequestListType } from './RequestList.vue';
import Button from './Button.vue';
import { useRequestStore } from '@/stores/request.store';

const requestStore = useRequestStore();

onMounted(() => {
  requestStore.fetchSent();
  requestStore.fetchReceived();
})

const currentListType = ref<RequestListType>('sent');
const changeCurrentList = (to: RequestListType) => {
  currentListType.value = to;
}

const currentList = computed(() => {
  if (currentListType.value === 'sent') return requestStore.sent;
  return requestStore.received;
})


</script>

<template>
  <section>
    <RequestHeader />
    <div class="flex items-center px-4 gap-4 justify-center">
      <Button class="w-full" :on-click="() => changeCurrentList('sent')"
        :variant="currentListType === 'sent' ? 'primary' : 'secondary'" icon="fa-arrow-up" inverted>Sent</Button>
      <Button class="w-full" :on-click="() => changeCurrentList('received')"
        :variant="currentListType === 'received' ? 'primary' : 'secondary'" icon="fa-arrow-down"
        inverted>Received</Button>
    </div>

    <RequestList :type="currentListType" :requests="currentList" />


  </section>

</template>


<style scoped></style>
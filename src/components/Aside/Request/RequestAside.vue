<script setup lang="ts">
import { useAsideStore } from '@/stores/aside.store';
import { useRequestStore } from '@/stores/request.store';
import { computed } from 'vue';
import Button from '../../Button.vue';
import RequestHeader from './RequestHeader.vue';
import RequestList, { type RequestListType } from './RequestList.vue';

const requestStore = useRequestStore();
const asideStore = useAsideStore();

const currentList = computed(() => {
  if (asideStore.currentRequestType === 'sent') return requestStore.sent;
  return requestStore.received;
})

const changeCurrentType = (type: RequestListType) => {
  asideStore.changeRequestType(type);
}


</script>

<template>
  <section>
    <RequestHeader />
    <div class="flex items-center px-4 mt-4 gap-4 justify-center">
      <Button class="w-full" :on-click="() => changeCurrentType('received')"
        :variant="asideStore.currentRequestType === 'received' ? 'primary' : 'secondary'" icon="fa-arrow-down" inverted>
        Received
      </Button>
      <Button class="w-full" :on-click="() => changeCurrentType('sent')"
        :variant="asideStore.currentRequestType === 'sent' ? 'primary' : 'secondary'" icon="fa-arrow-up" inverted>
        Sent
      </Button>
    </div>

    <hr class="border-slate-800 my-4" />
    <RequestList :type="asideStore.currentRequestType" :requests="currentList" />
  </section>

</template>


<style scoped></style>
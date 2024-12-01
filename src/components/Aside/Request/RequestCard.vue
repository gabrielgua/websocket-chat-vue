<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import Spinner from '@/components/Spinner.vue';
import { useRequestStatusStore } from '@/stores/request.status.store';
import type { User } from '@/types/user.type';
import { displayFullTimestamp } from '@/utils/date';
import { computed, ref } from 'vue';
import Button from '../../Button.vue';
import type { RequestListType } from './RequestList.vue';


const props = defineProps<{
  user: User;
  createdAt: string;
  status: string;
  type: RequestListType;
}>();


const requestStatusStore = useRequestStatusStore();

const modalActive = ref(false);

const sent = computed(() => {
  return props.type === 'sent';
})

const received = computed(() => {
  return props.type === 'received';
})


const toggleModalActive = () => {
  modalActive.value = !modalActive.value
}

const cancelRequest = (receiverId: number) => {
  requestStatusStore.cancelRequest(receiverId);
}

const denyRequest = (requesterId: number) => {
  console.log('deny: ', requesterId);
}

const handleOnConfirm = (userId: number) => {
  toggleModalActive();

  if (sent.value) {
    cancelRequest(userId);
  }

  if (received.value) {
    denyRequest(userId);
  }
}

const isLoading = (id: number) => {
  return requestStatusStore.state.loading && requestStatusStore.state.id === id;
}


</script>

<template>
  <div class="flex flex-col p-4 relative">
    <div v-if="isLoading(user.id)"
      class="absolute grid place-items-center rounded bg-slate-900/80 z-10 w-full h-full top-0 left-0">
      <Spinner type="spinner" />
    </div>
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
        <p class="text-xs">{{ displayFullTimestamp(new Date(createdAt)) }}</p>
      </div>
      <span v-if="sent" class="text-slate-500">-</span>
      <div v-if="sent" class="flex items-center gap-1">
        <fa-icon icon="fa-solid fa-info-circle" class="text-slate-500" />
        <p class="text-xs">{{ status }}</p>
      </div>

      <Button class="ml-auto" :on-click="toggleModalActive" rounded variant="secondary" icon="fa-trash"
        :tooltip="sent ? 'Cancel' : 'Deny'" />
      <Button v-if="received" rounded variant="success" icon="fa-check" tooltip="Accept" />
    </div>

    <Modal action-buttons :modal-active="modalActive" @on-confirm="() => handleOnConfirm(user.id)"
      @on-close="toggleModalActive" :title="`${sent ? 'Cancel' : 'Deny'} request?`" confirm-text="Yes">

      <p v-if="sent" class="text-sm text-slate-400">
        Cancelling a sent request will erase it permanently. <br />
        This will not prevent you to send another request to
        <span class="font-semibold text-slate-300 ">
          {{ user.username }}
        </span>.
      </p>
      <p v-if="received" class="text-sm text-slate-400">
        Deniyng a received request will erase it permanently. <br />
        This will not prevent
        <span class="font-semibold text-slate-300 ">
          {{ user.username }}
        </span>
        to send you another request.
      </p>
    </Modal>
  </div>
</template>

<style scoped></style>
<script setup lang="ts">
import { useRequestStore } from '@/stores/request.store';
import { computed, onMounted, ref } from 'vue';
import Button from './Button.vue';
import Spinner from './Spinner.vue';

type FriendFormButton = {
  icon: string;
  tooltip: string;
  variant: 'primary' | 'secondary'
  event: 'to-chat' | 'to-received' | 'to-sent' | 'on-send'
}

const props = defineProps<{
  id: number;
  name: string;
  username: string;
  friends: boolean;
  avatarUrl: string;
  requestSent: boolean;
  requestReceived: boolean;
}>();

onMounted(() => {
  button.value = buttons.get(getButtonVariantIndex());
})

const requestStore = useRequestStore();
const emit = defineEmits(['to-chat', 'to-received', 'to-sent', 'on-send']);
const loading = computed(() => requestStore.individualState.loading && requestStore.individualState.id === props.id);

const button = ref<FriendFormButton>();
const buttons: Map<string, FriendFormButton> = new Map([
  ['friends', { event: 'to-chat', icon: 'fa-comment', tooltip: 'Chat', variant: 'secondary' }],
  ['sent', { event: 'to-sent', icon: 'fa-envelope', tooltip: 'Sent requests', variant: 'secondary' }],
  ['received', { event: 'to-received', icon: 'fa-envelope', tooltip: 'Received requests', variant: 'secondary' }],
  ['send', { event: 'on-send', icon: 'fa-user-plus', tooltip: 'Send request', variant: 'primary' }],
])

const getButtonVariantIndex = () => {
  if (props.friends) return 'friends';
  else if (props.requestReceived) return 'received';
  else if (props.requestSent) return 'sent';
  return 'send';
}

</script>
<template>
  <li
    class="relative flex items-center gap-4 p-4 first:border-t first:border-slate-800 first:rounded-t-xl last:rounded-b-xl "
    :class="{ 'overflow-hidden': loading }">
    <div v-if="loading" class="absolute z-20 grid place-items-center top-0 left-0 w-full h-full bg-slate-950/80">
      <Spinner type="spinner" />
    </div>

    <img class="rounded-full w-10 ring-2 ring-sky-600/30 ring-offset-2 ring-offset-slate-800" :src="avatarUrl">

    <div>
      <div class="flex items-center gap-2">
        <h5 class="font-semibold text-sm">{{ name }} </h5>
        <div v-if="friends" class="mr-2">
          <fa-icon title="Friends" icon="fa-user-group" class="text-xs text-sky-600/80" />
        </div>

        <div v-else-if="requestSent || requestReceived" class="relative"
          :title="`Request ${requestSent ? 'sent' : 'received'}`">
          <fa-icon :icon="requestSent ? 'fa-share' : 'fa-reply'"
            class="absolute bottom-1 -right-1 z-10 text-[10px] text-sky-600" />
          <fa-icon icon="fa-envelope" class="text-sm text-sky-600/60" />
        </div>

      </div>
      <p class="text-xs text-slate-400">@{{ username }} </p>
    </div>

    <Button class="ml-auto" :on-click="() => emit(button!.event)" :icon="button?.icon" :variant="button?.variant"
      :tooltip="button?.tooltip" tooltip-pos="left" rounded />
  </li>
</template>


<style scoped></style>
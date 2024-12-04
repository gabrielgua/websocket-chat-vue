<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store';

const { toasts, dismiss } = useToastStore();


import { TransitionGroup } from 'vue';
import Toast from './Toast.vue';
import MessageToast from './MessageToast.vue';



</script>
<template>
  <Teleport to="body">

    <Transition name="toast-list" mode="out-in">
      <div v-if="toasts.length" class="z-40 absolute top-0 right-0 m-8 max-h-dvh flex flex-col items-end">
        <TransitionGroup name="toast-list" tag="ul" class="relative">
          <li v-for="toast in toasts" :key="toast.id" class="last:mb-0 mb-4">
            <MessageToast v-if="toast.variant === 'user'" :title="toast.title" :description="toast.description!"
              :avatar-url="toast.avatarUrl!" :remaining-seconds="toast.remainingSeconds"
              @on-dismiss="() => dismiss(toast.id)" />

            <Toast v-else :title="toast.title" :variant="toast.variant" :description="toast.description"
              :remaining-seconds="toast.remainingSeconds" :url="toast.avatarUrl"
              @on-dismiss="() => dismiss(toast.id)" />
          </li>
        </TransitionGroup>
      </div>
    </Transition>
  </Teleport>
</template>


<style scoped>
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 250ms ease;
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  scale: .95;
  /* transform: translateX(50px); */
}

.toast-list-leave-active {
  position: absolute;
}
</style>
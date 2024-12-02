<script setup lang="ts">
import AsideMenu from '@/components/Aside/AsideMenu.vue';
import Button from '@/components/Button.vue';
import ChatComponent from '@/components/Chat/Chat.vue';
import Logo from '@/components/Logo.vue';
import RightMenu from '@/components/RightMenu.vue';

import { useAsideStore } from '@/stores/aside.store';
import { useFriendStore } from '@/stores/friend.store';
import { useRequestStore } from '@/stores/request.store';
import { useToastStore } from '@/stores/toast.store';
import Handler from '@/utils/handler';
import { computed, onMounted } from 'vue';

const asideStore = useAsideStore();
const friendStore = useFriendStore();
const requestStore = useRequestStore();
const { toast } = useToastStore();

onMounted(() => {
  friendStore.fetchFriends();
  requestStore.fetchReceived();
  requestStore.fetchSent();

  new Handler().init();
})


const activeComponent = computed(() => asideStore.currentMenu.component);

</script>

<template>
  <div class="antialiased relative flex content-start bg-slate-900 mx-auto container-width text-white">
    <div class="grid grid-cols-[1fr_auto] min-h-dvh">
      <AsideMenu />

      <div class="flex flex-col h-full w-[400px]">
        <Logo />
        <Transition name="aside" mode="out-in">
          <component :is="activeComponent" />
        </Transition>
      </div>
    </div>

    <ChatComponent class="flex-grow" />

    <section class="absolute top-0 left-40 mt-auto flex gap-2">

      <Button
        :on-click="() => toast('Test one', undefined, 'This is a test notification for testing either the animations and the functionality.')"
        variant="primary">Info</Button>
      <Button :on-click="() => toast('Something went wrong', 'danger', 'Please try again later.')"
        variant="danger">Danger</Button>
      <Button :on-click="() => toast('This was a success', 'success', 'Something was a success, were proud of you.')"
        variant="success">Success</Button>

    </section>

    <!-- <RightMenu /> -->

  </div>
</template>

<style scoped>
.container-width {
  --container-width: 1500px;
  --container-margin: 1rem;

  width: min(var(--container-width), 100%);
  height: 100dvh;
}

.aside-enter-active {
  transition: all 250ms ease;
}

.aside-leave-active {
  transition: all 50ms ease;
}

.aside-enter-from,
.aside-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}


@media (max-width: 1500px) {
  .container-width {
    --container-margin: 0;
    --container-height: 100dvh;
  }
}
</style>

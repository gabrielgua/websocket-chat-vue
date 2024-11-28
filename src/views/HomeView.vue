<script setup lang="ts">
import AsideMenu from '@/components/Aside/AsideMenu.vue';
import ChatAside from '@/components/Aside/Chat/ChatAside.vue';
import RequestAside from '@/components/Aside/Request/RequestAside.vue';
import ChatComponent from '@/components/Chat/Chat.vue';
import Logo from '@/components/Logo.vue';

import { useAsideStore, type AsideType } from '@/stores/aside.store';
import { computed, Transition } from 'vue';

const asideStore = useAsideStore();

const isCurrent = (type: AsideType) => {
  return asideStore.currentMenu === type;
}

const activeComponent = computed(() => {
  if (isCurrent('chats')) return ChatAside;
  if (isCurrent('requests')) return RequestAside;
});

</script>

<template>
  <div class="antialiased flex content-start bg-slate-900 mx-auto container-width text-white">
    <div class="grid grid-cols-[1fr_auto] min-h-dvh">
      <AsideMenu />

      <div class="flex flex-col h-full min-w-[400px]">
        <Logo />
        <Transition name="aside" mode="out-in">
          <component :is="activeComponent" />
        </Transition>
      </div>
    </div>

    <ChatComponent class="flex-grow" />
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

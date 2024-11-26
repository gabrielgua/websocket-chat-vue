<script setup lang="ts">
import ChatComponent from '@/components/Chat/Chat.vue';
import ChatAside from '@/components/ChatAside.vue';
import Logo from '@/components/Logo.vue';
import Menu from '@/components/Menu.vue';

</script>

<template>


  <div class="antialiased flex  content-start bg-slate-900 mx-auto container-width text-white">

    <div class="grid grid-cols-[1fr_auto] overflow-hidden min-h-dvh">
      <Menu />


      <div class="flex flex-col h-full min-w-[400px]">
        <Logo />
        <ChatAside />
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

@media (max-width: 1500px) {
  .container-width {
    --container-margin: 0;
    --container-height: 100dvh;
  }
}
</style>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import FriendForm from '@/components/FriendForm.vue';
import Modal from '@/components/Modal.vue';
import { useRequestStore } from '@/stores/request.store';
import { useUserSearchStore } from '@/stores/user.search.store';
import { ref } from 'vue';
import FriendList from './FriendList.vue';

const friendModalActive = ref(false);

const searchStore = useUserSearchStore();
const requestStore = useRequestStore();

function toggleFriendModal() {
  searchStore.reset();
  requestStore.resetIndividualState();
  friendModalActive.value = !friendModalActive.value;
}
</script>

<template>
  <section>
    <div class="px-4 mt-6 grid gap-3">

      <div class="flex items-center gap-2 justify-between">
        <h3 class="text-lg font-bold">Friends</h3>
        <Button icon="fa-user-plus" :on-click="toggleFriendModal" variant="secondary" inverted rounded
          tooltip="Add friend" tooltip-pos="right" />
      </div>
    </div>
    <hr class="border-slate-800 mt-4" />

    <FriendList />

    <Modal :modal-active="friendModalActive" @on-close="toggleFriendModal" title="Find and add users">
      <FriendForm @close-modal="toggleFriendModal" />
    </Modal>
  </section>
</template>


<style scoped></style>
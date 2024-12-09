<script setup lang="ts">
import { useRequestStore } from '@/stores/request.store';
import { useUserSearchStore } from '@/stores/user.search.store';
import { ref } from 'vue';
import Button from '../../Button.vue';
import FriendForm from '../../FriendForm/FriendForm.vue';
import Modal from '../../Modal.vue';

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
        <h3 class="text-lg font-bold">Requests</h3>
        <Button icon="fa-plus" :on-click="toggleFriendModal" variant="secondary" inverted rounded tooltip="New Request"
          tooltip-pos="right" />
      </div>
    </div>

    <Modal :modal-active="friendModalActive" @on-close="toggleFriendModal" title="Find and add users">
      <FriendForm @close-modal="toggleFriendModal" />
    </Modal>

  </section>
</template>

<style scoped></style>
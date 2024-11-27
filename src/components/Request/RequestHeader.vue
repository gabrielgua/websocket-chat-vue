<script setup lang="ts">
import { useUserSearchStore } from '@/stores/userSearch.store';
import { ref } from 'vue';
import Button from '../Button.vue';
import Modal from '../Modal.vue';
import FriendForm from '../FriendForm.vue';

const friendModalActive = ref(false);

const searchStore = useUserSearchStore();

function toggleFriendModal() {
  searchStore.reset();
  friendModalActive.value = !friendModalActive.value;
}

</script>

<template>
  <section>
    <div class="px-4 mt-6 grid gap-3">

      <div class="flex items-center gap-2 justify-between">
        <h3 class="text-lg font-bold">Requests</h3>
        <Button icon="fa-user-plus" :on-click="toggleFriendModal" variant="secondary" inverted>
          Find friends
        </Button>
      </div>
    </div>
    <hr class="border-slate-800 my-4" />

    <Modal :modal-active="friendModalActive" @close-modal="toggleFriendModal" title="Find and add users">
      <FriendForm />
    </Modal>
  </section>
</template>

<style scoped></style>
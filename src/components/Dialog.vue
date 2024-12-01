<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Button from './Button.vue';
import Modal from './Modal.vue';

const props = defineProps<{
  show: boolean,
  title?: string,
  variant?: 'success' | 'error'
}>()

const show = computed(() => props.show);

const emit = defineEmits(['dialog-close'])

const onClose = () => {
  emit('dialog-close');
}

</script>
<template>
  <Modal :title="title ? title : undefined" :modal-active="show" @on-close="onClose">
    <slot />

    <Button variant="primary" icon="fa-check" :on-click="onClose" inverted>Ok</Button>
  </Modal>
</template>


<style scoped></style>
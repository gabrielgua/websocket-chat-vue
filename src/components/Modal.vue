<script setup lang="ts">
import Button from './Button.vue';


defineProps({
  modalActive: { type: Boolean, default: false },
  actionButtons: { type: Boolean, default: false },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  title: String
})

defineEmits(['on-close', 'on-confirm'])


</script>

<template>
  <Teleport to="body">
    <Transition name="outer-modal">
      <div @click.self="$emit('on-close')" v-show="modalActive"
        class="absolute z-20 top-0 left-0 bg-black/60 w-full h-full grid place-items-center ">

        <Transition name="content-modal">
          <div v-if="modalActive"
            class="modal-container transition-all bg-slate-900 text-white p-6 border border-slate-800/60 shadow rounded-xl flex flex-col gap-6 max-h-dvh">
            <div class="relative flex items-center justify-between gap-5">
              <p class="text-lg font-bold mr-auto">{{ title ? title : 'Do you want to confirm the action?' }}</p>
              <Button :on-click="() => $emit('on-close')" class="absolute -top-0 -right-0 " icon="fa-xmark"
                variant="secondary-text" rounded />
            </div>
            <slot />
            <div v-if="actionButtons" class="flex gap-3 mt-3">

              <Button :on-click="() => $emit('on-confirm')" icon="fa-check" variant="primary" inverted>
                {{ confirmText }}
              </Button>
              <Button :on-click="() => $emit('on-close')" icon="fa-xmark" variant="secondary-text" inverted>
                {{ cancelText }}
              </Button>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>


<style scoped>
.modal-container {
  --modal-width: 600px;
  --margin-inline: 1rem;
  width: min(var(--modal-width), 100% - (var(--margin-inline) * 2));
}

.outer-modal-enter-active,
.outer-modal-leave-active {
  transition: all 250ms ease;
}

.outer-modal-enter-from,
.outer-modal-leave-to {
  opacity: 0;
}

.content-modal-enter-active,
.content-modal-leave-active {
  transition: all 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  /* cubic-bezier(.47,1.64,.41,.8); */
}

.content-modal-enter-from,
.content-modal-leave-to {
  scale: .85;
}
</style>
<script setup lang="ts">

defineProps({
  modalActive: { type: Boolean, default: false },
  actionButtons: { type: Boolean, default: true },
  title: String
})
defineEmits(['close-modal', 'confirm'])


</script>

<template>
  <Teleport to="body">
    <Transition name="outer-modal">
      <div @click.self="$emit('close-modal')" v-show="modalActive"
        class="absolute z-10 top-0 left-0 bg-black/60 w-full h-full grid place-items-center ">

        <Transition name="content-modal">
          <div v-if="modalActive"
            class="modal-container transition-all bg-slate-900 text-white p-6 shadow-sm rounded-md flex flex-col gap-6 max-h-dvh">
            <div class="relative flex items-center justify-between gap-5">
              <p class="text-lg font-bold mr-auto">{{ title ? title : 'Do you want to confirm the action?' }}</p>
              <button @click="$emit('close-modal')"
                class="absolute -top-0 -right-0 text-slate-500 hover:text-sky-600 px-3 rounded-full hover:bg-slate-500/10 self-start transition-all  aspect-square grid place-items-center">
                <fa-icon icon="fa-solid fa-xmark" />
              </button>
            </div>
            <slot />
            <div v-if="actionButtons" class="flex justify-end gap-3">
              <button
                class="p-3 px-4 transition-all hover:bg-slate-800 hover:text-red-300 text-sm text-slate-400 rounded-2xl flex gap-2 items-center"
                @click="$emit('close-modal')">
                <fa-icon icon="fa-solid fa-xmark" />
                <p>Close</p>
              </button>

              <button
                class="p-3 px-4 transition-all hover:bg-slate-800 hover:text-emerald-500 text-sm text-slate-400 rounded-2xl flex gap-2 items-center"
                @click="$emit('confirm')">
                <fa-icon icon="fa-solid fa-check" />
                <p>Confirm</p>
              </button>

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
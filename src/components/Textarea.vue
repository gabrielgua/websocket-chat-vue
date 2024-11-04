<script setup lang="ts">

const modelValue = defineModel<string>();

defineProps<{
  placeholder?: string,
  iconStart?: string,
  disabled?: boolean,
}>()

</script>
<template>
  <div
    class="bg-slate-800 rounded-lg hover:ring-2 focus-within:ring-2  hover:ring-slate-800 focus-within:!ring-sky-600  transition-all flex items-center gap-1 text-slate-500">
    <fa-icon v-if="iconStart" :icon="`fa-solid ${iconStart}`" class="ms-3 mt-4 place-self-start text-sm" />
    <textarea v-model="modelValue" type="text"
      class="bg-transparent p-3 w-full outline-none text-white font-light text-sm resize-none"
      :placeholder="placeholder" :disabled="disabled"></textarea>
  </div>
</template>



<style scoped></style>
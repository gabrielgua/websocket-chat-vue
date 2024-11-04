<script setup lang="ts">
import type { Component, InputTypeHTMLAttribute } from 'vue';

const model = defineModel<string>();

defineProps<{
  placeholder?: string,
  type: InputTypeHTMLAttribute,
  iconStart?: string,
  iconEnd?: string,
  disabled?: boolean,
  as?: string | Component,
}>()
</script>

<template>
  <div
    class="bg-slate-800 rounded-lg hover:ring-2 focus-within:ring-2  hover:ring-slate-800 focus-within:!ring-sky-600  transition-all flex items-center gap-1 text-slate-500">
    <fa-icon v-if="iconStart" :icon="`fa-solid ${iconStart}`" class="ms-3 text-sm"
      :class="{ 'place-self-start mt-4': as === 'textarea' }" />
    <input v-model="model" class="bg-transparent p-3 w-full outline-none text-white font-light text-sm resize-none"
      :placeholder="placeholder" :type="type ? type : 'text'" :disabled="disabled" />
    <fa-icon v-if="iconEnd" :icon="`fa-solid ${iconEnd}`" class="me-3 text-sm"
      :class="{ 'place-self-start mt-4': as === 'textarea' }" />
  </div>
</template>


<style scoped></style>
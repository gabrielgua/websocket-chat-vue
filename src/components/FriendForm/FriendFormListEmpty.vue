<script setup lang="ts">
defineProps<{
  show: boolean
}>();
</script>
<template>
  <li v-if="show" class="p-4 border-t border-slate-800 rounded-t-xl">
    <p class="text-slate-400 font-semibold text-sm mb-2">No user found 😿</p>
    <p class="text-slate-500 text-[12px]">
      This could have happend either because the search term was wrong or we don't have any user with the
      search
      term name or username.
    </p>
  </li>
</template>

<style scoped></style>
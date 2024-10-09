<script setup lang="ts">
import { onMounted } from 'vue';



const props = defineProps<{
  name: string,
  isCurrent?: boolean,
  color?: string
}>();


function generateNameAbreviation() {
  const names = props.name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}
</script>

<template>
  <div class="group-hover:bg-slate-900 relative w-12 min-w-12 grid place-items-center rounded-full aspect-square"
    :class="[isCurrent ? 'bg-slate-900' : 'bg-slate-800']">
    <p class="font-bold" :class="[color ? color : '']">{{ generateNameAbreviation() }}</p>

  </div>
</template>


<style scoped></style>
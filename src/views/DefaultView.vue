<script setup lang="ts">
    import { RouterView } from 'vue-router';
</script>

<template>
    <header>
        <h1>WebSocket Chat</h1>
    </header>

    <RouterView />
</template>

<style scoped>
    header {
        padding: 1rem;
    }
</style>


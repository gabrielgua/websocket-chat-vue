<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth.store';
import { useStompStore } from '@/stores/stomp.store';
    import { ref } from 'vue';

    const username = ref('');
    const password = ref('');

    const authStore = useAuthStore();

    function login() {
        authStore.login(username.value, password.value);
        clearInputs();
    }

    function clearInputs() {
        username.value = '';
        password.value = '';
    }
</script>

<template>
    <form @submit.prevent="login">
        <h3>Login</h3>
        <input required v-model="username" type="text" placeholder="Username">
        <input required v-model="password" type="password" placeholder="Password">
        <button type="submit" :disabled="authStore.state.loading">{{ authStore.state.loading ? 'Loading...' : 'Login' }}</button>
    </form>
</template>

<style scoped>
    form {
        width: min(200px, 100% - 5rem);
        display: flex;
        flex-direction: column;
        margin: 1rem;
    }

    h3 {
        margin-bottom: 1rem;
    }

    input {
        margin-bottom: .5rem;
    }
</style>
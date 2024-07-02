<script setup lang="ts">
    import DefaultView from './views/DefaultView.vue';
</script>


<template>
    <RouterView></RouterView>
</template>

<style global>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif
    }

    body {
        --container-outline-clr: #222831;
        --df-border-clr: #222831;

        background-color: var(--container-outline-clr);

    }

    .button {
        border: none;
        cursor: pointer;
        background-color: transparent;
        transition: all ease-out 150ms;
    }

    .button:hover {
        transform: translateY(-0.125rem);
    }

</style>

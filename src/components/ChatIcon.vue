<script setup lang="ts">
    import { useChatStore } from '@/stores/chat.store';
    import { ChatType, type Chat } from '@/types/chat.type';
    import { computed, type ComputedRef } from 'vue';
    const chatStore = useChatStore();

    const props = defineProps<{
        chat: Chat
    }>();

    const isCurrent: ComputedRef<boolean> = computed(() => {
        return chatStore.current.id === props.chat.id;
    })

    function isPrivate() {
        return props.chat.type === ChatType.private; 
    }

    function isGroup() {
        return props.chat.type === ChatType.group; 
    }

    function displayPrivateName(name: string) {
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    }

</script>

<template>
    <div 
        class="group-hover:bg-slate-900 relative w-12 min-w-12 grid place-items-center rounded-full aspect-square"
        :class="[isCurrent ? 'bg-slate-900' : 'bg-slate-800']"
    >
        <fa-icon icon="fa-solid fa-users" class="block" v-if="isGroup()" />
        <p class="font-medium" v-else>{{ displayPrivateName(chat.receiver!.name) }}</p>
    </div>
</template>


<style scoped>

</style>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/types/user.type';
import { ref } from 'vue';

type ChatFormType = 'group' | 'private';
type UserForm = {
  id: number,
  username: string
}

const auth = useAuthStore();

const chatType = ref<ChatFormType>('group');
const chatUsers = ref<UserForm[]>([
  { id: auth.authentication.userId, username: auth.authentication.username },
  { id: 2, username: 'gabrielgua' }
])

function selectType(type: ChatFormType) {
  chatType.value = type;
}

function removeMember(user: UserForm) {
  if (user.id === auth.authentication.userId) {
    return;
  }
  chatUsers.value = chatUsers.value.filter(u => u.id !== user.id);
}

type ChatTypes = {
  name: string,
  value: 'group' | 'private',
  icon?: string
}

const chatTypes: ChatTypes[] = [
  { name: 'Group', value: 'group', icon: 'fa-user-group' },
  { name: 'Private', value: 'private', icon: 'fa-user' }
]

</script>

<template>
  <form @submit.prevent="" class="flex flex-col gap-6">

    <section class="text-sm">
      <p class="mb-3 text-slate-400 font-bold">Chat type</p>
      <div class="flex">
        <button v-for="type in chatTypes" type="button" @click="selectType(type.value)"
          class="transition-all flex gap-2 items-center p-2 px-4 rounded-lg"
          :class="[chatType === type.value ? 'text-slate-300 bg-slate-800' : 'text-slate-500']">
          <fa-icon :icon="'fa-solid ' + type.icon" class="text-sky-600" />
          <p>{{ type.name }}</p>
        </button>
      </div>
    </section>

    <hr class="border-slate-800/80">

    <section v-if="chatType === 'group'">
      <p class="text-sm text-slate-400 font-bold mb-3">Chat information</p>
      <div class="mb-5">
        <div class="bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
          <fa-icon icon="fa-solid fa-comment" />
          <input id="chatName" class="bg-transparent p-3 w-full outline-none text-white font-light text-sm"
            placeholder="Chat name" type="text">
        </div>
        <div class="mt-2 bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
          <fa-icon icon="fa-solid fa-comment" class="self-start mt-4" />
          <textarea id="chatDescription"
            class="resize-none bg-transparent p-3 w-full outline-none text-white font-light text-sm"
            placeholder="Description (optional)" type="text" />
        </div>

      </div>
      <p class="text-sm text-slate-400 font-bold">Members</p>
      <div class="mt-3 bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
        <fa-icon icon="fa-solid fa-magnifying-glass" />
        <input id="chatName" class="bg-transparent p-3 w-full outline-none text-white font-light text-sm"
          placeholder="Search for usernames for your new group" type="text">

      </div>
      <ul class="mt-3 flex items-center gap-2">
        <li :title="chatUsers.length + ' total members. '" class="text-sm flex items-center gap-2 mr-2">
          <fa-icon icon="fa-solid fa-users" class="text-sm text-sky-600 block" />
          <p class="font-bold text-slate-300">{{ chatUsers.length }}</p>
        </li>
        <li v-for="user in chatUsers">
          <div class="bg-slate-800 w-max pr-3 rounded-full  p-0.5  flex gap-2 items-center">
            <div class="bg-slate-900 w-6 grid place-items-center aspect-square rounded-full">
              <fa-icon icon="fa-solid fa-user" class="text-[9px] text-sky-600 block" />
            </div>
            <p class="text-[12px] text-slate-300">{{ user.id === auth.authentication.userId ? 'You' :
              user.username }}</p>
            <button v-if="user.id !== auth.authentication.userId" @click="removeMember(user)">
              <fa-icon icon="fa-solid fa-xmark" class="text-sm text-slate-600 hover:text-red-300" />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <hr class="border-slate-800/80">

    <section>
      <button class="p-3 px-4  transition-all bg-sky-600 text-sm text-white rounded-2xl flex gap-2 items-center">
        <fa-icon icon="fa-solid fa-check" />
        <p>Create chat</p>
      </button>
    </section>



  </form>
</template>


<style scoped></style>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useFriendStore } from '@/stores/friend.store';
import type { ChatRequest } from '@/types/chat.request.type';
import { ChatType } from '@/types/chat.type';
import type { User } from '@/types/user.type';
import { computed, onMounted, ref } from 'vue';
import Button from './Button.vue';

onMounted(() => {
  friendStore.fetchFriends();
})

defineEmits(['submitted'])

type UserForm = {
  id: number,
  username: string,
  avatarUrl?: string
}

const authStore = useAuthStore();
const chatStore = useChatStore();
const friendStore = useFriendStore();



const chatType = ref<ChatType>();
const chatName = ref<string>('');
const chatDescription = ref<string>('');

const memberSearch = ref<string>('');

const friendsFiltered = computed<User[]>(() => {
  return friendStore.friends
    .filter(friend => {
      let term = memberSearch.value.trim().toLocaleLowerCase();
      return friend.name.toLocaleLowerCase().trim().includes(term) || friend.username.toLocaleLowerCase().includes(term);
    })
})

const chatUsers = ref<UserForm[]>([
  {
    id: authStore.authentication.userId,
    username: 'You',
    avatarUrl: authStore.authentication.avatarUrl
  },
])

function selectType(type: ChatType) {
  chatType.value = type;
  nextStep('chat-info', false)
}

function removeMember(userId: number) {
  if (userId === authStore.authentication.userId) {
    return;
  }
  chatUsers.value = chatUsers.value.filter(u => u.id !== userId);
}

function addMember(user: UserForm) {
  if (chatUsers.value.find(u => u.id === user.id)) {
    return;
  }

  chatUsers.value.push(user);
}

type ChatTypes = {
  name: string,
  value: ChatType,
  icon?: string
}

type FormSteps = {
  name: string,
  show: boolean
}

const chatTypes: ChatTypes[] = [
  { name: 'Group', value: ChatType.group, icon: 'fa-user-group', },
  { name: 'Private', value: ChatType.private, icon: 'fa-user', }
]

const steps = ref<FormSteps[]>([
  { name: 'chat-type', show: true },
  { name: 'chat-info', show: false },
  { name: 'chat-members', show: false },
]);

function nextStep(to: string, hidePrevious: boolean) {
  if (hidePrevious) {
    hideAll();
  }

  const next = steps.value.find(step => step.name === to);
  if (!next) return;

  next.show = !next.show;
}

function hideAll() {
  steps.value.forEach(step => step.show = false);
}

function show(name: string) {
  return find(name)?.show;
}

function find(name: string) {
  const step = steps.value.find(step => step.name === name);
  if (step) return step;
}

function canSelectMembers() {
  return chatType.value === ChatType.group && chatName.value.length > 3 && (show('chat-info'));
}

function canConfirmGroup() {
  return chatUsers.value.length > 1;
}

function isAdded(userId: number) {
  return chatUsers.value.find(u => u.id === userId);
}

function createGroupChat() {

  var newChat: ChatRequest = {
    name: chatName.value,
    description: chatDescription.value,
    type: chatType.value!,
    users: chatUsers.value.map(user => user.id)
  }

  chatStore.createChat(newChat);

}

</script>

<template>
  <form @submit.prevent="createGroupChat" class="flex flex-col h-full">

    <Transition name="step">

      <section class="text-sm" v-if="show('chat-type')">
        <p class="text-slate-400 font-bold">Chat Type</p>
        <p class="mb-3 text-[12px] text-slate-500">What type will your chat be?</p>
        <div class="flex gap-3">
          <button v-for="type in chatTypes" type="button" @click="selectType(type.value)"
            class="transition-all flex gap-2 items-center p-2 px-4 rounded-lg hover:bg-slate-800 "
            :class="[chatType === type.value ? 'text-slate-300 bg-slate-800' : 'text-slate-500 bg-slate-800/30']">
            <fa-icon :icon="'fa-solid ' + type.icon" class="text-sky-600" />
            <p>{{ type.name }}</p>
          </button>
        </div>
      </section>
    </Transition>

    <Transition name="step">
      <section v-if="chatType === ChatType.group && show('chat-info')" class="mt-6">
        <p class="text-slate-400 font-bold">Chat Information</p>
        <p class="mb-3 text-[12px] text-slate-500">What is your chat going to be called? Will it have a description?</p>
        <div>
          <div class="bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
            <fa-icon icon="fa-solid fa-comment" />
            <input v-model="chatName" id="chatName"
              class="bg-transparent p-3 w-full outline-none text-white font-light text-sm" placeholder="Chat name"
              type="text">
          </div>
          <div class="mt-2 bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
            <fa-icon icon="fa-solid fa-pen" class="self-start mt-4" />
            <textarea v-model="chatDescription" id="chatDescription"
              class="resize-none bg-transparent p-3 w-full outline-none text-white font-light text-sm"
              placeholder="Description (optional)" type="text" />
          </div>
        </div>
      </section>

    </Transition>

    <Transition name="step">

      <section v-if="show('chat-members')">
        <p class="text-slate-400 font-bold">Chat Members</p>
        <p class="mb-3 text-[12px] text-slate-500">
          Select the members for the
          <span class="text-white font-bold">'{{ chatName }}'</span>
          chat.
        </p>
        <div class="mt-3 bg-slate-800 rounded-md flex items-center gap-1 ps-3 text-slate-500">
          <fa-icon icon="fa-solid fa-magnifying-glass" />
          <input v-model="memberSearch" class="bg-transparent p-3 w-full outline-none text-white font-light text-sm"
            placeholder="Search for friends" type="text">
        </div>

        <ul class="flex flex-wrap gap-3 mt-3">
          <li class="flex gap-2 items-center">
            <fa-icon icon="fa-icon fa-users" class="text-sky-600" />
            <p class="font-bold text-sm">{{ chatUsers.length }}</p>
          </li>
          <li v-for="user in chatUsers">
            <div class="bg-slate-800 rounded-full flex gap-2 items-center pe-3">
              <img :src="user.avatarUrl" class="w-6 rounded-full" />
              <p class="text-sm text-slate-300">{{ user.username }}</p>
            </div>
          </li>
        </ul>

        <ul
          class="mt-4 rounded-lg grid divide-y divide-slate-800 border border-slate-800 overflow-hidden overflow-y-auto max-h-[50rem] flex-grow">

          <li class="p-3" v-if="!friendsFiltered.length">
            <p class="text-sm text-slate-400 font-semibold">No friends found 😿</p>
            <p class="text-[12px] text-slate-500">Try adding some friends before creating a group chat.</p>
          </li>

          <TransitionGroup name="friend-list">
            <li v-if="friendsFiltered.length" v-for="friend in friendsFiltered">
              <div class="flex gap-2 p-2 items-center transition-all" :class="{ 'bg-sky-600/30': isAdded(friend.id) }">
                <img class="w-10 aspect-square block" :src="friend.avatarUrl" alt="profile pic">
                <span class="text-sm">
                  <p class="font-semibold">{{ friend.name }}</p>
                  <p class="text-[12px] text-slate-400">@{{ friend.username }}</p>
                </span>
                <section class="flex gap-2 ms-auto">
                  <Button v-if="!isAdded(friend.id)"
                    :on-click="() => addMember({ id: friend.id, username: friend.username, avatarUrl: friend.avatarUrl })"
                    icon="fa-add" variant="primary" rounded />

                  <Button v-else :on-click="() => removeMember(friend.id)" icon="fa-trash" variant="danger" rounded />
                </section>
              </div>
            </li>
          </TransitionGroup>

        </ul>
      </section>
    </Transition>


    <Transition name="step">
      <section class="mt-6" v-if="canSelectMembers()">
        <Button :on-click="() => nextStep('chat-members', true)" icon="fa-arrow-right" variant="primary">
          Select members
        </Button>
      </section>
    </Transition>

    <Transition name="step">
      <section class="mt-6" v-if="canConfirmGroup()">
        <Button :on-click="() => $emit('submitted')" icon="fa-check" variant="primary" submit>
          Create chat
        </Button>
      </section>
    </Transition>
  </form>
</template>


<style scoped>
.step-enter-active {
  transition: all 250ms ease;
}

.step-leave-active {
  transition: all 0ms;
}

.step-enter-from {
  scale: .85;
  opacity: 0;
}

.step-leave-to {
  opacity: 0;
  scale: .85;
}

.friend-list-enter-active

/* .friend-list-leave-active { */
  {
  transition: all 250ms ease;
}

.friend-list-leave-active {
  transition: all 0ms;
}

.friend-list-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.friend-list-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>
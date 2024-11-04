<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useFriendStore } from '@/stores/friend.store';
import type { ChatRequest } from '@/types/chat.request.type';
import { ChatType } from '@/types/chat.type';
import type { User } from '@/types/user.type';
import { computed, onMounted, ref } from 'vue';
import Button from '../Button.vue';
import Input from '../Input.vue';
import Textarea from '../Textarea.vue';

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

const chatType = ChatType.group;
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

type FormSteps = {
  name: string,
  show: boolean
}

const steps = ref<FormSteps[]>([
  { name: 'chat-info', show: true },
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
  return chatName.value.length > 3 && (show('chat-info'));
}

function canConfirmGroup() {
  return chatUsers.value.length > 1;
}

function isAdded(userId: number) {
  return chatUsers.value.find(u => u.id === userId);
}

function createGroupChat() {
  if (!chatName.value || chatUsers.value.length < 2) {
    return;
  }


  var newChat: ChatRequest = {
    name: chatName.value,
    description: chatDescription.value,
    type: chatType,
    users: chatUsers.value.map(user => user.id)
  }

  chatStore.createChat(newChat);

}

</script>

<template>
  <form @submit.prevent="createGroupChat" class="flex flex-col h-full">

    <Transition name="step">
      <section v-if="show('chat-info')">
        <p class="text-slate-400 font-bold">Chat Information</p>
        <p class="mb-3 text-[12px] text-slate-500">What is your chat going to be called? Will it have a description?</p>
        <Input as="input" type="text" v-model="chatName" placeholder="Chat name" icon-start="fa-comment" />

        <Textarea class="mt-4" icon-start="fa-pen" placeholder="Description (optional)" v-model="chatDescription" />
      </section>

    </Transition>

    <Transition name="step">

      <section v-if="show('chat-members')">

        <div class="flex items-center gap-3 mb-5">
          <Button :on-click="() => nextStep('chat-info', true)" variant="secondary" icon="fa-arrow-left" rounded
            tooltip="Chat information" tooltip-pos="top-start" />
          <div>
            <p class="text-slate-400 font-bold">Chat Members</p>
            <p class="text-[12px] text-slate-500">
              Select the members for the
              <span class="text-white font-bold">'{{ chatName }}'</span>
              chat.
            </p>
          </div>
        </div>
        <Input icon-start="fa-magnifying-glass" placeholder="Search for friends" type="text" v-model="memberSearch" />


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

        <ul class="mt-4 rounded-lg grid divide-y divide-slate-800 border border-slate-800  max-h-[50rem] flex-grow">

          <Transition name="step">
            <li class="p-3" v-if="!friendsFiltered.length">
              <p class="text-sm text-slate-400 font-semibold">No friends found 😿</p>
              <p class="text-[12px] text-slate-500">Try adding some friends before creating a group chat.</p>
            </li>
          </Transition>

          <TransitionGroup name="friend-list" tag="ul">
            <li v-if="friendsFiltered.length" v-for="friend in friendsFiltered">
              <div class="flex gap-2 p-2 items-center transition-all"
                :class="{ 'bg-sky-600/10 rounded-md': isAdded(friend.id) }">
                <img class="w-10 aspect-square block" :src="friend.avatarUrl" alt="profile pic">
                <span class="text-sm">
                  <p class="font-semibold">{{ friend.name }}</p>
                  <p class="text-[12px] text-slate-400">@{{ friend.username }}</p>
                </span>
                <section class="flex gap-2 ms-auto">
                  <Button v-if="!isAdded(friend.id)" :tooltip="`Add ${friend.username}`" tooltip-pos="left"
                    :on-click="() => addMember({ id: friend.id, username: friend.username, avatarUrl: friend.avatarUrl })"
                    icon="fa-add" variant="primary" rounded />

                  <Button v-else :tooltip="`Remove ${friend.username}`" tooltip-pos="left"
                    :on-click="() => removeMember(friend.id)" icon="fa-trash" variant="danger" rounded />
                </section>
              </div>

            </li>
          </TransitionGroup>

        </ul>
      </section>
    </Transition>


    <Transition name="step">
      <section class="mt-6 place-self-start" v-if="canSelectMembers()">
        <Button :on-click="() => nextStep('chat-members', true)" icon="fa-arrow-right" variant="primary">
          Chat members
        </Button>
      </section>
    </Transition>

    <Transition name="step">
      <section class="mt-6 place-self-start" v-if="canConfirmGroup()">
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
  transition: all 0ms ease;
}

.step-leave-to,
.step-enter-from {
  scale: .85;
  opacity: 0;
  position: absolute;
}

.friend-list-move,
.friend-list-enter-active,
.friend-list-leave-active {
  transition: all 250ms ease;
}

.friend-list-enter-from,
.friend-list-leave-to {
  opacity: 0;
  scale: .95;
}

.friend-list-leave-active {
  position: absolute;
}
</style>
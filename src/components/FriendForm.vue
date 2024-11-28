<script setup lang="ts">
import { useRequestStore } from '@/stores/request.store';
import { useUserSearchStore } from '@/stores/userSearch.store';
import { ref } from 'vue';
import Button from './Button.vue';
import Input from './Input.vue';
import Spinner from './Spinner.vue';
import { useFriendStore } from '@/stores/friend.store';
import { useAsideStore } from '@/stores/aside.store';
import { useChatStore } from '@/stores/chat.store';


const searchStore = useUserSearchStore();
const requestStore = useRequestStore();
const friendStore = useFriendStore();
const asideStore = useAsideStore();
const chatStore = useChatStore();

const term = ref('');

const emit = defineEmits(['close-modal'])

const findByTerm = () => {
  if (!term.value.length) {
    return;
  }

  searchStore.findByNameOrUsername(term.value);
}

const closeForm = () => {
  emit('close-modal')
  console.log('close-modal');
}

const goToChat = (receiverId: number) => {
  closeForm();
  asideStore.changeCurrent('chats');

  const chat = chatStore.findPrivateByReceiver(receiverId);
  if (chat) {
    chatStore.changeCurrent(chat);
  }
}

const goToReceived = () => {
  closeForm();
  asideStore.changeCurrent('requests');
  requestStore.changeCurrentType('received');
}

const goToSent = () => {
  closeForm();
  asideStore.changeCurrent('requests');
  requestStore.changeCurrentType('sent');
}

const sendRequest = (receivedId: number) => {
  requestStore.sendRequest(receivedId);
}

</script>

<template>
  <form class="flex flex-col gap-10">
    <section>
      <label for="search" class="text-slate-400 font-bold">Search for users</label>
      <p class="mb-3 text-[12px] text-slate-500">Find users to start new chats with.</p>
      <Input v-debounce.500ms="findByTerm" v-model="term" id="search" icon-start="fa-magnifying-glass" type="text"
        placeholder="Search by name or username" />
    </section>

    <Transition name="fade">
      <section v-if="searchStore.state.loading">
        <Spinner type="dots" />
      </section>
    </Transition>


    <Transition name="fade">
      <section v-if="searchStore.state.empty && !searchStore.state.loading"
        class="border border-slate-800 p-3 rounded-lg">
        <p class="text-slate-400 font-semibold text-sm mb-2">No user found 😿</p>
        <p class="text-slate-500 text-[12px]">
          This could have happend either because the search term was wrong or we don't have any user with the search
          term name or username.
        </p>
      </section>
    </Transition>

    <Transition name="fade">
      <section v-if="searchStore.searchUsers.length && !searchStore.state.loading && !searchStore.state.empty">
        <ul class="flex flex-col gap-2">
          <li v-for="user in searchStore.searchUsers" :key="user.id"
            class="border border-slate-800 flex items-center rounded-xl shadow gap-3 p-3">
            <img class="rounded-full w-10 ring-2 ring-sky-600 ring-offset-2 ring-offset-slate-800"
              :src="user.avatarUrl">
            <div>
              <h5 class="font-bold">{{ user.name }}</h5>
              <p class="text-[12px] text-slate-400">@{{ user.username }} </p>
            </div>
            <div class="ml-auto">
              <Spinner v-if="requestStore.individualState.loading && requestStore.individualState.id === user.id"
                type="spinner" />

              <div v-else-if="requestStore.alreadySent(user.id)" class="flex items-center gap-2 ">
                <p class="text-slate-400 text-xs">Request sent</p>
                <Button :on-click="goToSent" icon="fa-user-group" rounded variant="primary"
                  tooltip="Go to sent requests" />
              </div>
              <p v-else-if="requestStore.individualState.error" class="text-xs text-rose-400 px-2">
                Something went wrong
              </p>

              <div v-else-if="friendStore.alreadyFriends(user.id)" class="flex items-center gap-2 ">
                <p class="text-slate-400 text-xs">Friends</p>
                <Button :on-click="() => goToChat(user.id)" icon="fa-comment" rounded variant="primary"
                  tooltip="Go to chat" tooltip-pos="right" />
              </div>

              <div v-else-if="requestStore.alreadyReceived(user.id)" class="flex items-center gap-2 ">
                <p class="text-slate-400 text-xs">Sent you a request</p>
                <Button :on-click="goToReceived" icon="fa-user-group" rounded variant="primary"
                  tooltip="Go to requests" />
              </div>

              <Button v-else icon="fa-user-plus" :on-click="() => sendRequest(user.id)" inverted variant="primary">
                <p>Send request</p>
              </Button>
            </div>
          </li>

        </ul>
      </section>

    </Transition>
  </form>
</template>

<style scoped>
.fade-enter-active {
  transition: all 250ms ease;
}

.fade-leave-active {
  transition: all 0ms ease;

}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  scale: .95;
  position: absolute;
}
</style>
<script setup lang="ts">
import FriendFormCard from '@/components/FriendForm/FriendFormCard.vue';
import { useAsideStore } from '@/stores/aside.store';
import { useChatStore } from '@/stores/chat.store';
import { useFriendStore } from '@/stores/friend.store';
import { useRequestStore } from '@/stores/request.store';
import { useUserSearchStore } from '@/stores/user.search.store';
import { ref } from 'vue';
import FriendFormListEmpty from '../FriendForm/FriendFormListEmpty.vue';
import Input from '../Input.vue';
import Spinner from '../Spinner.vue';
import JumpInTransition from '../Transitions/JumpInTransition.vue';
import { emitter } from '@/services/mitt';
import { useToastStore } from '@/stores/toast.store';


const searchStore = useUserSearchStore();
const requestStore = useRequestStore();
const friendStore = useFriendStore();
const asideStore = useAsideStore();
const chatStore = useChatStore();
const { toast } = useToastStore();

const term = ref('');
const result = ref('');
const emit = defineEmits(['close-modal'])


const findByTerm = () => {
  if (!term.value.length) {
    return;
  }

  searchStore.findByNameOrUsername(term.value);
  result.value = term.value;
}


const closeForm = () => {
  emit('close-modal')
}

const goToChat = (receiverId: number) => {
  closeForm();
  asideStore.changeMenu('chats');

  const chat = chatStore.findPrivateByReceiver(receiverId);
  if (chat) {
    chatStore.changeCurrent(chat);
  }
}

const goToReceived = () => {
  closeForm();
  asideStore.changeMenu('requests');
  asideStore.changeRequestType('received');
}

const goToSent = () => {
  closeForm();
  asideStore.changeMenu('requests');
  asideStore.changeRequestType('sent');
}

const sendRequest = (receivedId: number) => {
  requestStore.sendRequest(receivedId);
}


emitter.on('requestSent', (e) => {

  closeForm();
  toast('Request Sent', 'success', 'Your request was successfully sent!')
  asideStore.changeMenu('requests');
  asideStore.changeRequestType('sent');
})



</script>

<template>
  <form>
    <section>
      <label for="search" class="text-slate-400 font-bold">Search for users</label>
      <p class="mb-3 text-[12px] text-slate-500">Find users to start new chats with.</p>
      <Input v-debounce.500ms="findByTerm" v-model="term" id="search" icon-start="fa-magnifying-glass" type="text"
        placeholder="Search by name or username" />
    </section>


    <JumpInTransition class="mt-4">
      <div v-if="searchStore.state.loading" class="grid pt-4 place-items-center">
        <Spinner type="spinner" />
      </div>

      <section v-else-if="searchStore.state.touched" class="border-slate-800 rounded-xl border transition-all">
        <div class="flex items-center">
          <h2 class="font-semibold text-sm p-4">Results</h2>
          <p class="text-xs bg-slate-800 p-2 rounded-xl text-slate-300">"{{ result }}"</p>
        </div>

        <ul class="flex flex-col divide-y divide-slate-800 max-h-[427px] overflow-y-auto">
          <FriendFormListEmpty :show="!searchStore.searchUsers.length" />
          <FriendFormCard v-for="user in searchStore.searchUsers" :key="user.id" :id="user.id" :name="user.name"
            :username="user.username" :avatar-url="user.avatarUrl" :friends="friendStore.alreadyFriends(user.id)"
            :request-sent="requestStore.alreadySent(user.id)" :request-received="requestStore.alreadyReceived(user.id)"
            @to-chat="goToChat(user.id)" @to-received="goToReceived" @to-sent="goToSent"
            @on-send="sendRequest(user.id)" />
        </ul>
      </section>
    </JumpInTransition>

  </form>
</template>

<style scoped>
::-webkit-scrollbar {
  width: .25rem;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(2 132 199);
  border-radius: .25rem;
}

::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>
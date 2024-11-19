<script setup lang="ts">
import { useUserSearchStore } from '@/stores/userSearch.store';
import { ref } from 'vue';
import Button from './Button.vue';
import Input from './Input.vue';
import Spinner from './Spinner.vue';


const searchStore = useUserSearchStore();
const term = ref('');

const findByTerm = () => {
  if (!term.value.length) {
    return;
  }

  searchStore.findByNameOrUsername(term.value);
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
              <p class="text-sm text-slate-400">@{{ user.username }} </p>
            </div>
            <div class="ml-auto">
              <Button icon="fa-user-plus" inverted variant="primary">
                Send request
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
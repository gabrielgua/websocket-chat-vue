import type { RequestListType } from "@/components/Aside/Request/RequestList.vue";
import { defineStore } from "pinia";
import { ref, shallowRef, type Component } from "vue";
import { useChatStore } from "./chat.store";
import type { User } from "@/types/user.type";
import ChatAside from "@/components/Aside/Chat/ChatAside.vue";
import RequestAside from "@/components/Aside/Request/RequestAside.vue";
import FriendAside from "@/components/Aside/Friend/FriendAside.vue";

export type AsideType = "profile" | "chats" | "requests" | "friends";

type Menu = {
  name: string;
  type: AsideType;
  icon: string;
  notification?: boolean;
  component: Component;
};

export const useAsideStore = defineStore("aside", () => {
  const defaultRequestListType: RequestListType = "received";

  const chatsMenu: Menu = {
    name: "Chats",
    type: "chats",
    icon: "fa-comments",
    notification: false,
    component: shallowRef(ChatAside),
  };

  const requestsMenu: Menu = {
    name: "Requests",
    type: "requests",
    icon: "fa-envelope",
    notification: false,
    component: shallowRef(RequestAside),
  };

  const friendsMenu: Menu = {
    name: "Friends",
    type: "friends",
    icon: "fa-user-group",
    notification: false,
    component: shallowRef(FriendAside),
  };

  const initialMenus: Menu[] = [chatsMenu, requestsMenu, friendsMenu];

  const chatStore = useChatStore();
  const currentMenu = ref<Menu>(chatsMenu);
  const menus = ref<Menu[]>(initialMenus);

  const currentRequestType = ref<RequestListType>(defaultRequestListType);

  const changeRequestType = (type: RequestListType) => {
    currentRequestType.value = type;
  };

  const addNotification = (type: AsideType) => {
    const menu = menus.value.find((m) => m.type === type);
    if (menu && menu.type !== currentMenu.value.type) {
      menu.notification = true;
    }
  };

  const clearNotification = (type: AsideType) => {
    const menu = menus.value.find((m) => m.type === type);
    if (menu) {
      menu.notification = false;
    }
  };

  const changeMenu = (to: AsideType) => {
    const menu = menus.value.find((m) => m.type === to);
    if (menu) {
      currentMenu.value = menu;
      clearNotification(menu.type);
    }
  };

  const reset = () => {
    currentMenu.value = chatsMenu;
    currentRequestType.value = defaultRequestListType;
    menus.value = initialMenus;
  };

  const goToUserChat = (user: User) => {
    changeMenu("chats");
    const chat = chatStore.findPrivateByReceiver(user.id);
    if (chat) {
      chatStore.changeCurrent(chat);
    }
  };

  return {
    menus,
    currentMenu,
    currentRequestType,
    changeMenu,
    changeRequestType,
    reset,
    goToUserChat,
    addNotification,
    clearNotification,
  };
});

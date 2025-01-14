import { http } from "@/services/http";
import { emitter } from "@/services/mitt";
import type { AxiosError } from "axios";
import { isBefore } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, reactive, type ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { useStompStore } from "./stomp.store";
import { useFriendStore } from "./friend.store";
import { useRequestStore } from "./request.store";
import { useAsideStore } from "./aside.store";
import { useRequestStatusStore } from "./request.status.store";
import { useChatStore } from "./chat.store";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const stompStore = useStompStore();
  const friendStore = useFriendStore();
  const requestStore = useRequestStore();
  const chatStore = useChatStore();
  const asideStore = useAsideStore();
  const requestStatusStore = useRequestStatusStore();

  type Authentication = {
    userId: number;
    username: string;
    avatarUrl: string;
    token: string;
  };

  const state = reactive({ loading: false, error: false });
  const authentication = reactive<Authentication>({} as Authentication);

  const authenticated: ComputedRef<boolean> = computed(() => {
    return checkAuthentication();
  });

  function login(username: string, password: string) {
    state.loading = true;
    state.error = false;

    http
      .post("/api/auth/login", { username: username, password: password })
      .then((response) => {
        console.log(response);

        saveAuthentication(
          response.data.userId,
          response.data.username,
          response.data.token,
          response.data.avatarUrl
        );
        router.push("/chat");
      })
      .catch((e: AxiosError) => {
        state.error = true;
        console.log("error: ", e.message);
      })
      .finally(() => (state.loading = false));
  }

  function clearAuthentication() {
    authentication.token = "";
    authentication.userId = 0;
    authentication.username = "";
  }

  function logout() {
    stompStore.disconnectAndUnsubscribe().then(() => {
      router.push("/login");
      localStorage.clear();
      clearAuthentication();
      emitter.all.clear();

      chatStore.reset();
      friendStore.reset();
      requestStore.reset();
      requestStatusStore.reset();
      asideStore.reset();
    });
  }

  function saveAuthentication(
    id: number,
    username: string,
    token: string,
    avatarUrl: string
  ) {
    authentication.userId = id;
    authentication.username = username;
    authentication.token = token;
    authentication.avatarUrl = avatarUrl;

    localStorage.setItem("userId", id.toString());
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("avatarUrl", avatarUrl);
  }

  function checkAuthentication(): boolean {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const avatarUrl = localStorage.getItem("avatarUrl");

    if (token && username && userId && avatarUrl) {
      const decodedToken = jwtDecode(token);

      const isSameUser = decodedToken.sub === username;
      const expiryDate = new Date(decodedToken.exp! * 1000);
      const isTokenValid = isBefore(new Date(), expiryDate);

      if (isSameUser && isTokenValid) {
        saveAuthentication(+userId, username, token, avatarUrl);
      }
    }

    return (
      !!authentication.token &&
      !!authentication.username &&
      !!authentication.userId &&
      !!authentication.avatarUrl
    );
  }

  return {
    authentication,
    authenticated,
    state,
    login,
    logout,
    checkAuthentication,
  };
});

import { http } from "@/services/http";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { computed, reactive, type ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { useStompStore } from "./stomp.store";
import { emitter } from "@/services/mitt";
import { jwtDecode } from "jwt-decode";
import { isAfter, isBefore } from "date-fns";
import { useChatStore } from "./chat.store";
import { useMessageStore } from "./message.store";
import { useUserStore } from "./user.store";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const userStore = useUserStore();
  const stompStore = useStompStore();

  type Authentication = {
    userId: number;
    username: string;
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
          response.data.token
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
    });
  }

  function saveAuthentication(id: number, username: string, token: string) {
    authentication.userId = id;
    authentication.username = username;
    authentication.token = token;

    localStorage.setItem("userId", id.toString());
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  }

  function checkAuthentication(): boolean {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (token && username && userId) {
      const decodedToken = jwtDecode(token);

      const isSameUser = decodedToken.sub === username;
      const expiryDate = new Date(decodedToken.exp! * 1000);
      const isTokenValid = isBefore(new Date(), expiryDate);

      if (isSameUser && isTokenValid) {
        saveAuthentication(+userId, username, token);
      }
    }

    return (
      !!authentication.token &&
      !!authentication.username &&
      !!authentication.userId
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

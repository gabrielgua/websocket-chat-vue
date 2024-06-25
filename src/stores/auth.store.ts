import { http } from "@/services/http";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { computed, reactive, type ComputedRef } from "vue";
import { useRouter } from "vue-router";
import { useStompStore } from "./stomp.store";
import { emitter } from "@/services/mitt";

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const stompStore = useStompStore();

    type Authentication = {
        userId: number,
        username: string,
        token: string,
    }

    const state = reactive({loading: false, error: false});
    const authentication = reactive<Authentication>({} as Authentication);

    const authenticated: ComputedRef<boolean> = computed(() => {
        return checkAuthentication();
    })

    function login(username: string, password: string) {
        state.loading = true;
        state.error = false;

        http.post('/auth/login', {username: username, password: password})
            .then(response => {
                saveAuthentication(response.data.senderId, response.data.username, response.data.token);
                router.push('/chat');
            }).catch((e: AxiosError) => {
                state.error = true;
                console.log('error: ', e.message);
            }).finally(() => state.loading = false);
    }

    function clearAuthentication() {
        authentication.token = '';
        authentication.userId = 0;
        authentication.username = '';
    }

    function logout() {
        stompStore.disconnectAndUnsubscribe()   
            .then((message) => {
                console.log(message);
                localStorage.clear();
                clearAuthentication();
                router.push('/login');
                emitter.all.clear();
            });


    }
    
    function saveAuthentication(id: number, username: string, token: string) {
        authentication.userId = id;
        authentication.username = username;
        authentication.token = token;

        localStorage.setItem('userId', id.toString());
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
    }

    function checkAuthentication(): boolean {
        var token = localStorage.getItem('token');
        var userId = localStorage.getItem('userId');
        var username = localStorage.getItem('username');

        if (token && username && userId) {
            saveAuthentication(+userId, username, token);
        }

        return authentication.token != '' && authentication.token != null 
    }


    return { authentication, authenticated, state, login, logout, checkAuthentication }
});
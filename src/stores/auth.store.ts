import { http } from "@/services/http";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAuthStore = defineStore('auth', () => {

    const authentication = reactive<{
        senderId?: number,
        username?: string,
        token?: string
    }>({});


    function login(username: string, password: string) {
        http.post('/auth/login', {username: username, password: password})
            .then(response => {
                authentication.senderId = response.data.senderId;
                authentication.username = response.data.username;
                authentication.token = response.data.token;
            })
    }

    return { authentication, login }
});
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080",
});

const PUBLIC_API_ENDPOINTS: String[] = [
  "/api/auth/register",
  "/api/auth/login",
];

http.interceptors.request.use((config) => {
  if (PUBLIC_API_ENDPOINTS.includes(config.url!)) {
    return config;
  }

  const authStore = useAuthStore();
  config.headers.Authorization = `Bearer ${authStore.authentication.token}`;
  return config;
});

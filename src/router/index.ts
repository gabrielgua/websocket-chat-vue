import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/chat', component: () => import('@/views/DefaultView.vue'), children: [
        { path: '/chat', name: 'chat', component: () => import('@/views/HomeView.vue') },
        { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') }
    ] },
  ]
})


router.beforeEach((to, from, next) => {
    const privateRoutes = ['/chat'];
    const authRoutes = ['/login', '/register'];

    const auth = useAuthStore();

    if (privateRoutes.includes(to.path) && !auth.authenticated) {
        next({ path: '/login' });
    }
    else if (authRoutes.includes(to.path) && auth.authenticated) {
        next({ path: '/chat' })
    }
    else next();
});

export default router;

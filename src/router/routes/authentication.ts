// authentication.ts
import { RouteRecordRaw } from 'vue-router';
import LoginForm from '@/components/authentication/LoginForm.vue';
import GithubRedirection from '@/components/authentication/GithubRedirection.vue';

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login-view',
    component: LoginForm,
    meta: { title: 'Login' }
  },
  {
    path: '/github-redirect-uri',
    name: 'github-redirection',
    component: GithubRedirection,
    meta: { title: 'Logging in...' }
  },
];

export default authRoutes;

// posts.ts
import { RouteRecordRaw } from 'vue-router';
import MyInfo from '@/components/users/MyInfo.vue';

const userRoutes: Array<RouteRecordRaw> = [
  {
    path: '/users/me',
    name: 'my-info',
    component: MyInfo,
    meta: { title: 'My Info' }
  },
];

export default userRoutes;

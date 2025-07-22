// general.ts
import { RouteRecordRaw } from 'vue-router';
import MainView from '@/views/MainView.vue';
import PostList from '@/components/posts/PostList.vue';

const generalRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: MainView,
    meta: { title: 'Home' }
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostList,
    meta: { title: 'Posts' }
  },
];

export default generalRoutes;

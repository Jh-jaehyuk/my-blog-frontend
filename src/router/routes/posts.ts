// posts.ts
import { RouteRecordRaw } from 'vue-router';
import PostRead from '@/components/posts/PostRead.vue';
import PostCreate from '@/components/posts/PostCreate.vue';
import PostUpdate from '@/components/posts/PostUpdate.vue';

const postRoutes: Array<RouteRecordRaw> = [
  {
    path: '/posts/:postId',
    name: 'post-read',
    component: PostRead,
    props: true,
    meta: { title: 'View Post' } // Dynamic title will be set in the component
  },
  {
    path: '/posts/new',
    name: 'post-create',
    component: PostCreate,
    meta: { title: 'Create Post' }
  },
  {
    path: '/posts/:postId/edit',
    name: 'post-edit',
    component: PostUpdate,
    props: true,
    meta: { title: 'Edit Post' }
  },
];

export default postRoutes;

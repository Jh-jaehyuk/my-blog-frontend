import { createRouter, createWebHistory } from 'vue-router'
import generalRoutes from './routes/general'
import postRoutes from './routes/posts'
import authRoutes from './routes/authentication'
import userRoutes from './routes/users'

const routes = [
  ...generalRoutes,
  ...postRoutes,
  ...authRoutes,
  ...userRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const DEFAULT_TITLE = "Jh's blog";

router.afterEach((to) => {
  document.title = to.meta.title ? `${DEFAULT_TITLE} | ${to.meta.title}` : DEFAULT_TITLE;
});

export default router

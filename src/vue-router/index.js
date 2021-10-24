import AppContent from '@/AppContent'
import Homepage from '@/vue/pages/Homepage'

import { createRouter, createWebHistory } from 'vue-router'
import { vueRoutes } from '@/vue-router/routes'

const routes = [
  {
    path: '/',
    name: vueRoutes.app.name,
    redirect: vueRoutes.homepage,
    component: AppContent,
    children: [
      {
        path: '/homepage',
        name: vueRoutes.homepage.name,
        component: Homepage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: _ => ({ x: 0, y: 0 }),
})

export default router
export { vueRoutes }

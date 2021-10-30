import Vue from 'vue'
import VueRouter from 'vue-router'
import { vueRoutes } from '@/vue-router/routes'

import AppContent from '@/vue/AppContent'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: vueRoutes.app.name,
    component: AppContent,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: _ => ({ x: 0, y: 0 }),
})

export default router

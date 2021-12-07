import Vue from 'vue'
import VueRouter from 'vue-router'
import { vueRoutes } from '@/vue-router/routes'

import AppContent from '@/vue/AppContent'
import Generate from '@/vue/pages/Generate'
import UploadFilePage from '@/vue/pages/UploadFilePage'
import GetFiles from '@/vue/pages/GetFiles'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: vueRoutes.app.name,
    redirect: vueRoutes.generate,
    component: AppContent,
    children: [
      {
        path: '/generate',
        name: vueRoutes.generate.name,
        component: Generate,
      },
      {
        path: '/upload-file',
        name: vueRoutes.uploadFile.name,
        component: UploadFilePage,
      },
      {
        path: '/get-files',
        name: vueRoutes.getFiles.name,
        component: GetFiles,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: _ => ({ x: 0, y: 0 }),
})

export default router

import { createStore } from 'vuex'
import { sessionStoragePlugin } from '@/vuex/plugins/session-storage'

export const rootModule = {
  mutations: {
  },
  actions: {
  },
  getters: {
  },
}

export const store = createStore({
  ...rootModule,
  modules: { },
  plugins: [sessionStoragePlugin],
})

export { vuexTypes } from './types'

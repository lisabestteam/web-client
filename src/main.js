import './scss/app.scss'

import Vue from 'vue'
import App from '@/vue/App'
import router from '@/vue-router'

import AppButton from '@/vue/common/AppButton'

Vue.config.productionTip = false

async function init () {
  /* eslint-disable no-new */
  Vue.component('app-button', AppButton)

  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
  })
}

init()

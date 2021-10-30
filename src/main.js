import Vue from 'vue'
import App from '@/vue/App'
import router from '@/vue-router'

Vue.config.productionTip = false

async function init () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
  })
}

init()

import '@/scss/app.scss'

import App from '@/App.vue'
import router from '@/vue-router'

import { store } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { CONFIG } from '@/config'
import { i18n } from '@/i18n'
import { ripple, clickOutside } from '@/vue/directives'
import { createApp, h, getCurrentInstance } from 'vue'
import { useFormatDate } from '@/vue/composables'

const app = createApp({
  setup () {
    const app = getCurrentInstance()

    const {
      formatDate,
      formatDateDMY,
      formatDateDMYT,
      formatCalendar,
      formatCalendarInline,
    } = useFormatDate()

    /* eslint-disable max-len */
    app.appContext.config.globalProperties.$fd = formatDate
    app.appContext.config.globalProperties.$fddmy = formatDateDMY
    app.appContext.config.globalProperties.$fddmyt = formatDateDMYT
    app.appContext.config.globalProperties.$fcalend = formatCalendar
    app.appContext.config.globalProperties.$fcalendi = formatCalendarInline
    /* eslint-enable max-len */
  },
  render: () => h(App),
})

app
  .use(store)
  .use(router)
  .use(i18n)

app.config.globalProperties.$routes = vueRoutes
app.config.globalProperties.$config = CONFIG

app.directive('ripple', ripple)
app.directive('click-outside', clickOutside)

app.mount('#app')

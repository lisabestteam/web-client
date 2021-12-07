<template>
  <div class="app-content">
    <navbar />
    <div class="app-content__main">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/vue/navigation/Navbar'

export default {
  name: 'app-content',
  components: {
    Navbar,
  },

  data: _ => ({
  }),

  computed: {
  },
}
</script>

<style lang="scss">

.app-content__main {
  padding: 4.8rem 6.4rem;
}
</style>

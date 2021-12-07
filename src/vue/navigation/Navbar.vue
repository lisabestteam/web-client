<template>
  <nav class="navbar">
    <div class="navbar__main">
      <router-link
        class="navbar__link"
        :to="vueRoutes.generate"
      >
        {{ 'Create Seed' }}
      </router-link>

      <router-link
        class="navbar__link"
        :to="vueRoutes.uploadFile"
      >
        {{ 'Upload File' }}
      </router-link>

      <router-link
        class="navbar__link"
        :to="vueRoutes.getFiles"
      >
        {{ 'Create Seed' }}
      </router-link>
    </div>
  </nav>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'navbar',

  data: _ => ({
    vueRoutes,
  }),

  computed: {},
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.navbar {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  height: 7.8rem;
  padding: 0 6.4rem;
}

.navbar__main {
  display: flex;
}

.navbar__link {
  color: $col-link;
  text-decoration: none;
  font-size: 1.8rem;

  & + & {
    margin-left: 2rem;
  }
}
</style>

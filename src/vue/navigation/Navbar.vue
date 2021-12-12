<template>
  <nav class="navbar">
    <div class="navbar__main">
      <router-link
        class="navbar__link"
        :to="vueRoutes.generate"
      >
        {{ 'Key pair generation' }}
      </router-link>

      <router-link
        class="navbar__link"
        :to="vueRoutes.uploadFile"
      >
        {{ 'File uploading' }}
      </router-link>

      <router-link
        class="navbar__link"
        :to="vueRoutes.getFiles"
      >
        {{ 'Receive files' }}
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

  computed: {

  },
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

  &.router-link-active {
    position: relative;

    &:before {
      content: '';
      display: block;
      width: 2.4rem;
      height: 0.2rem;
      position: absolute;
      bottom: -0.8rem;
      left: calc(50% - 1.2rem);
      background: $col-text;
    }
  }
}

</style>

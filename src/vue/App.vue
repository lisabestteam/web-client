<template>
  <div id="app" class="app__container">
    <div v-if="isLoaded" class="app__main">
      <router-view />
    </div>
    <p v-else>
      {{ 'Application initiation' }}
    </p>
  </div>
</template>

<script>
import { initApi } from '@api'

export default {
  name: 'app-content',

  data: () => ({
    isLoaded: false,
  }),

  async created () {
    this.isLoaded = false
    await initApi()
    this.isLoaded = true
  },
}
</script>

<template>
  <div id="app" class="app__container">
    <div class="app__main">
      <router-view />
    </div>
  </div>
</template>

<script>
import { initApi } from '@api'

export default {
  name: 'app-content',

  async created () {
    await initApi()
    console.log(123)
  },
}
</script>

<style lang="scss">

</style>

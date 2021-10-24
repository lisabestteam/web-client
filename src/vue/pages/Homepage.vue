<template>
  <div class="homepage">
    {{ $t('welcome') }}
  </div>
  <router-view />
</template>

<script>
export default {
  name: 'homepage',
}
</script>

<i18n>
{
  "en": {
    "welcome": "Welcome",
  }
}
</i18n>

<template>
  <button
    v-bind="$attrs"
    :type="$attrs.type || 'button'"
    v-on="$listeners"
    class="app-button"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>

<script>

export default {
  name: 'app-button',

  props: {
    disabled: { type: Boolean, default: false },
    text: { type: String, default: '' },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

$col-app-button-text: #ffffff;
$col-app-background: $col-primary;

.app-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  color: $col-app-button-text;
  background-color: $col-app-background;
  width: inherit;
  height: inherit;
  min-height: 4.8rem;
  min-width: 23.2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.6rem;
  border: none;
  position: relative;
  transition: transform 0.3s;

  &:active {
    transform: translateY(0.1rem);
  }

  &[disabled] {
    opacity: 0.7;
    cursor: default;
  }

  &--default-size {
    min-width: inherit;
    min-height: inherit;
  }
}
</style>

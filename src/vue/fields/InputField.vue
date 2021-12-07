<template>
  <div
    class="input-field"
    :class="[
      {
        'input-field--error': errorMessage,
        'input-field--readonly': $attrs.readonly || $attrs.readonly === '',
        'input-field--disabled': $attrs.disabled,
        'input-field--pwd-toggle-present': isPasswordType,
      }
    ]"
  >
    <span v-if="label" class="input-field__label">
      {{ label }}

      <template v-if="isCapsLockOn">
        ({{ 'input-field.caps-lock-warning' }})
      </template>
    </span>

    <input
      v-bind="$attrs"
      v-on="listeners"
      class="input-field__input"
      :type="isPasswordType && isPasswordShown ? 'text' : type"
      :value="value"
      :placeholder="$attrs.placeholder || ' '"
      :tabindex="$attrs.readonly || $attrs.readonly === ''
        ? -1
        : $attrs.tabindex"
      @focus="onFocus"
      @blur="onBlur"
    >

    <button
      v-if="isPasswordType"
      type="button"
      class="input-field__password-toggle"
      tabindex="-1"
      @click="isPasswordShown = !isPasswordShown"
    >
      <i
        class="mdi input-field__password-toggle-icon"
        :class="isPasswordShown ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      />
    </button>

    <transition name="input-field__err-transition">
      <p v-if="errorMessage" class="input-field__err-mes">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
import { MathUtil } from '@/js/helpers/math.util'

const EVENTS = {
  input: 'input',
}

const INPUT_TYPES = {
  password: 'password',
  number: 'number',
}

const inputTypeValidator = v => !v || Object.values(INPUT_TYPES).includes(v)

export default {
  name: 'input-field',
  props: {
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    errorMessage: { type: String, default: '' },
    type: { type: String, default: '', validator: inputTypeValidator },
    trim: { type: Boolean, default: true },
  },

  data: () => ({
    isCapsLockOn: false,
    isPasswordShown: false,
    EVENTS,
  }),

  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: event => {
          this.normalizeTargetValue(event.target)
          if (this.value === event.target.value) return
          this.$emit(EVENTS.input, event.target.value)
        },
      }
    },

    isPasswordType () {
      return this.type === INPUT_TYPES.password
    },
  },

  methods: {
    onFocus (event) {
      if (this.isPasswordType) {
        /**
         * Use two events to detect Caps Lock up and down.
         * If we will use only 'keydown', we can detect only Caps Lock press to
         * ON state, but we cannot detect the OFF state.
         *
         * Actual only for MacOS's browsers.
         */
        document.addEventListener('keydown', this.detectCapsLock)
        document.addEventListener('keyup', this.detectCapsLock)
      }
    },

    onBlur (event) {
      if (this.isPasswordType) {
        document.removeEventListener('keydown', this.detectCapsLock)
        document.removeEventListener('keyup', this.detectCapsLock)

        if (!this.value) this.isCapsLockOn = false
      }

      if (this.trim) {
        this.$emit(EVENTS.input, event.target.value.trim())
      }
    },

    /**
     * @param {KeyboardEvent} getModifierState
     *
     * @return {Boolean}
     */
    detectCapsLock (event) {
      this.isCapsLockOn =
        event.getModifierState &&
        event.getModifierState('CapsLock')
    },

    normalizeTargetValue (target) {
      if (target.value === '') return

      if (this.type === INPUT_TYPES.number) {
        const normalizeValue = this.normalizeDecimalPrecision(
          this.normalizeRange(target.value)
        )
        if (target.value !== normalizeValue) target.value = normalizeValue
      }
    },

    normalizeRange (value) {
      const max = this.$attrs.max

      let result = value
      if (max && MathUtil.compare(value, max) > 0) {
        result = max
      }

      return result
    },

    normalizeDecimalPrecision (value) {
      const step = this.$attrs.step
      if (!step) {
        return value
      }

      let precision
      try {
        precision = step.match(/(?:\.|,)\d+$/)[0].slice(1).length
      } catch (error) {
        precision = 0
      }

      let result = value
      if (precision) {
        const decimalsLongerThanPrecisionRe =
          new RegExp(`(?:\\.|,)\\d{${precision + 1},}$`)
        if (decimalsLongerThanPrecisionRe.test(value)) {
          const truncateExtraDecimalsRe =
            new RegExp(`((?:\\.|,)\\d{${precision}})\\d*`)
          result = value.replace(truncateExtraDecimalsRe, '$1')
        }
      }

      return result
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';
// @import '@/vue/fields/scss/_variables.scss';

$pwd-toggle-btn-width: 3.2rem;

.input-field {
  position: relative;
  width: 100%;
  flex: 1;
}

/* stylelint-disable no-descending-specificity */
.input-field__input {
  width: 100%;
  caret-color: $field-color-focused;
  color: $field-color-text;
  padding: $field-input-padding;
  background: $field-color-background;
  border-radius: 0;

  /* stylelint-disable property-no-vendor-prefix */
  -webkit-appearance: none;
  /* stylelint-enable property-no-vendor-prefix */

  // will work only when field not in the focus
  text-overflow: ellipsis;

  @include material-border($field-color-focused, $field-color-unfocused);
  @include text-font-sizes;

  &:read-only,
  &:disabled {
    cursor: default;
    filter: grayscale(100%);
    color: $field-color-unfocused;
    -webkit-text-fill-color: $field-color-unfocused;
  }

  // &::-webkit-input-placeholder {
  //   @include placeholder;
  // }

  // &::-moz-placeholder {
  //   @include placeholder;
  // }

  // &:-moz-placeholder {
  //   @include placeholder;
  // }

  // &:-ms-input-placeholder {
  //   @include placeholder;
  // }

  // &::placeholder {
  //   @include placeholder;
  // }

  // Hide number arrows
  &[type='number']:not(:hover):not(:focus) {
    // autoprefixer does not help us here
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      // autoprefixer does not help us here
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-appearance: none;
      margin: 0;
    }
  }

  // TODO: fix issue when decimal number entered in the input that have
  // mismatched "step" attribute
  //.input-field__input:not(:placeholder-shown):invalid,
  .input-field--error > & {
    border: 0.1rem solid $field-color-error;
  }

  .input-field--readonly > &,
  .input-field--disabled > & {
    border: 0.1rem solid $field-color-unfocused;
  }

  .input-field--pwd-toggle-present > & {
    padding-right: $pwd-toggle-btn-width + 3rem;
  }
}

.input-field__password-toggle {
  position: absolute;
  right: 3rem;
  top: $field-input-padding-top - 0.6rem;
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;

  .input-field__label ~ & {
    top: 3.9rem;
  }
}

.input-field__password-toggle-icon {
  position: relative;
  font-size: 2.4rem;
  top: 0.2rem;
  color: $field-placeholer-color;
}

.input-field__label {
  display: block;
  margin-bottom: 0.5rem;
  position: relative;
  pointer-events: none;
  color: $field-color-label;
  max-width: 100%;

  @include label-font-sizes;
}

/* stylelint-enable no-descending-specificity */

.input-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.input-field__err-transition-enter-active {
  animation:
    input-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out;
}

.input-field__err-transition-leave-active {
  animation:
    input-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out
    reverse;
}

@keyframes input-field__err-transition-keyframes {
  from {
    max-height: 0;
    margin-top: 0;
    overflow: hidden;
  }

  to {
    max-height: $field-error-font-size * $field-error-line-height;
    margin-top: $field-error-margin-top;
    overflow: hidden;
  }
}
</style>

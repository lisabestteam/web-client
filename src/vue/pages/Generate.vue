<template>
  <div class="generate-page">
    <div class="app__content-block generate-page__content">
      <div>
        <app-button
          text="Create Seed"
          @click="generateSeed"
        />
      </div>
      <h4 class="generate-page__header">
        {{ 'Public key' }}
      </h4>
      <p class="generate-page__key">
        {{ publicKey.toString() }}
      </p>

      <h4 class="generate-page__header">
        {{ 'Secret key' }}
      </h4>
      <p class="generate-page__key">
        {{ privateKey.toString() }}
      </p>

      <h4 class="generate-page__header">
        {{ 'Shared secret' }}
      </h4>
      <p class="generate-page__key">
        {{ sharedSecret.toString() }}
      </p>
    </div>
  </div>
</template>

<script>
import { random } from '@lukeed/csprng'
import { generateKeyPair } from 'curve25519-js'
import { u8aToHex } from '@polkadot/util'

export default {
  name: 'generate',

  data: () => ({
    publicKey: '',
    privateKey: '',
    sharedSecret: '',
  }),

  methods: {
    generateSeed () {
      const ran = random(32)
      const { public: publicKey, private: privateKey } = generateKeyPair(ran)
      this.publicKey = u8aToHex(publicKey)
      this.privateKey = u8aToHex(privateKey)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.generate-page__content {
  max-width: 75.2rem;
}
.generate-page__header {
  margin-top: 3.2rem;
  font-size: 1.4rem;
  font-weight: normal;
  margin-bottom: 0.8rem;
}

.generate-page__key {
  border: 0.1rem solid #e3e5e6;
  padding: 1rem;
  display: flex;
  align-items: center;
  min-height: 4rem;
  border-radius: 0.8rem;
}
</style>

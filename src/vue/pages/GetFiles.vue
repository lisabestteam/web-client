<template>
  <div class="get-files-page">
    <div class="app__content-block get-files-page__form">
      <div class="get-files-page__second-step">
        <h1 class="get-files-page__header">
          {{ 'Generate password' }}
        </h1>

        <input-field
          v-model="form.privateKey"
          class="get-files-page__input"
          name="change-password-current-password"
          label="Private key"
          :trim="false"
        />

        <input-field
          v-model="form.publicKey"
          class="get-files-page__input"
          name="change-password-current-password"
          label="Public key"
          :trim="false"
        />
        <app-button
          class="get-files-page__generate-pass-btn"
          text="Generate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputField from '@/vue/fields/InputField'

export default {
  name: 'upload-fiele',

  components: { InputField },

  data: _ => ({
    currentStep: 1,
    form: {
      publicKey: '0x5e2220a1a6bd23989973b9994e8cc0f934bca6951609c36fb025f68153280327',
      privateKey: '0x188f41691377c2bb5a2d945502c43d1ce92db8c4c7e2c4ff000c0986aaa3705a',
    },
  }),

  methods: {
    async uploadFromIPFS () {
      try {
        const tokentUri = 'https://gateway.ipfs.io/ipfs/QmSwuDnhhDHGKmW1UV3uAfc5Vkp5UMimfcwtM8y7DXYEmV'
        const test = await fetch(tokentUri)
        const blob = await test.blob()
        // console.log(ipfsApi)
        // const ipfs = ipfsApi({
        //   url: 'https://gateway.ipfs.io/ipfs/',
        // })
        // const t = await ipfs.get('QmSwuDnhhDHGKmW1UV3uAfc5Vkp5UMimfcwtM8y7DXYEmV')
        // console.log(t)
        // console.log(1234)
        // const test = await api.withBaseURL(tokentUri).getRaw('')
        // const file = new File([blob], 'name')
        let url = window.URL.createObjectURL(blob)
        console.log(url)

        // const ipfsResponse = await ipfs.add(JSON.stringify({
        //   file: this.form.file,
        //   object: 'dsds',
        // }))
        // console.log(ipfsResponse)
        // const ipfsFileLink = IPFS_URL + ipfsResponse.path
        // console.log(ipfsFileLink)
        // const file = ipfs.get('QmV3mKnUbekMEAXKPFQrXhQFF1KJ78qC6fAgvPRkmauz2y')
        // console.log(file)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.get-files-page__form {
  width: 70rem;
  max-width: 70rem;
}

.get-files-page__actions {
  margin-top: 4.5rem;
  display: flex;
  justify-content: space-between;
}

.get-files-page__button-arrow {
  font-size: 1.4rem;
}

.get-files-page__button-text {
  font-size: 1.4rem;

  &--next {
    margin-right: 1rem;
  }

  &--prev {
    margin-left: 1rem;
  }
}

.get-files-page__header {
  font-size: 2.4rem;
  font-weight: 500;
  margin-bottom: 3.3rem;
}

.get-files-page__input {
  margin-top: 3.3rem;
}
</style>

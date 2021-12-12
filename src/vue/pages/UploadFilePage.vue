<template>
  <div class="upload-file-page">
    <div class="app__content-block upload-file-page__form">
      <template v-if="currentStep === STEPS.step1">
        <div class="upload-file-page__firs-step">
          <file-field
            name="upload-file"
            v-model="form.file"
            :placeholder="'Select a file'"
            :min-width="120"
            :min-height="120"
            :max-size="20"
          />
        </div>
      </template>

      <template v-if="currentStep === STEPS.step2">
        <div class="upload-file-page__second-step">
          <h1 class="upload-file-page__header">
            {{ 'Enter data' }}
          </h1>

          <input-field
            v-model="form.senderPrivateKey"
            class="upload-file-page__input"
            name="change-password-current-password"
            label="Sender private key"
            :trim="false"
          />

          <input-field
            v-model="form.senderPublicKey"
            class="upload-file-page__input"
            name="change-password-current-password"
            label="Sender public key"
            :trim="false"
          />

          <input-field
            v-model="form.receiverPublicKey"
            class="upload-file-page__input"
            name="change-password-current-password"
            label="Receiver public key"
            :trim="false"
          />
        </div>
      </template>

      <template v-if="currentStep === STEPS.step3">
        <div class="upload-file-page__second-step">
          <h1 class="upload-file-page__header">
            {{ 'Upload file' }}
          </h1>

          <app-button
            class="upload-file-page__generate-pass-btn"
            :text="inProgress ? 'Uploading...' : 'Upload file'"
            :disabled="inProgress"
            @click="uploadToIPFS"
          />
        </div>
      </template>

      <div class="upload-file-page__actions">
        <button
          class="upload-file-page__button-step"
          :disabled="currentStep === STEPS.step1 || inProgress"
          type="button"
          @click="prevStep"
        >
          <i class="mdi mdi-arrow-left upload-file-page__button-arrow" />
          <span
            class="
            upload-file-page__button-text
            upload-file-page__button-text--prev
          ">
            {{ 'Previous' }}
          </span>
        </button>
        <button
          class="upload-file-page__button-step"
          :disabled="currentStep === STEPS.step3 || inProgress"
          type="button"
          @click="nextStep"
        >
          <span
            class="
              upload-file-page__button-text
              upload-file-page__button-text--next
            ">
            {{ 'Next' }}
          </span>
          <i class="mdi mdi-arrow-right upload-file-page__button-arrow" />
        </button>
      </div>
    </div>

    <div class="upload-file-page__steps">
      <div
        v-for="val in Object.values(STEPS)"
        :key="`point-${val}`"
        class="upload-file-page__point"
        :class="{'upload-file-page__point--current': currentStep === val}"
      />
    </div>
  </div>
</template>

<script>
import FileField from '@/vue/fields/FileField'
import InputField from '@/vue/fields/InputField'

import cryptoJs from 'crypto-js'
import { sharedKey } from 'curve25519-js'
import { u8aToHex, hexToU8a } from '@polkadot/util'
import { ipfs, api } from '@api'
import { base } from '@tokend/js-sdk'

const STEPS = {
  step1: 1,
  step2: 2,
  step3: 3,
}
export default {
  name: 'upload-fiele',

  components: { FileField, InputField },

  data: _ => ({
    currentStep: 1,
    form: {
      file: null,
      receiverPublicKey: '0x5e2220a1a6bd23989973b9994e8cc0f934bca6951609c36fb025f68153280327',
      senderPublicKey: '0xba9a3e01060fef326a69fd1b89c08b68141677fc1b392f57571153685c573006',
      senderPrivateKey: '0x98945c20792cd41d2473fce997ef5ce6a5238cf6ef291b64dc804afe69779f61',
    },
    encryptFile: '',
    inProgress: false,
    STEPS,
  }),

  methods: {
    async uploadToIPFS () {
      this.inProgress = true
      try {
        await this.encodeAES()
        const ipfsResponse = await ipfs.add(this.encryptFile)
        await this.sendToBCH(ipfsResponse.path)
        alert('File successfully uploaded')
        this.cleanForm()
        this.currentStep = 1
      } catch (e) {
        console.error(e)
      }
      this.inProgress = false
    },

    prevStep () { --this.currentStep },

    nextStep () { ++this.currentStep },

    async getFile () {
      /* eslint-disable */
      const getFile = new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = function (event) {
          resolve(event.target.result)
        }

        reader.onerror = (error) => {
          reject(error)
        }

        reader.readAsDataURL(this.form.file.file)
      })
      /* eslint-enable */

      return getFile
    },

    async encodeAES () {
      const key = sharedKey(
        hexToU8a(this.form.senderPrivateKey),
        hexToU8a(this.form.receiverPublicKey)
      )

      const file = await this.getFile()

      this.encryptFile = JSON.stringify({
        encFile: cryptoJs.AES.encrypt(file, u8aToHex(key)).toString(),
      })
    },

    async sendToBCH (fileHash) {
      const opts = base.CreateDataBuilder.createData({
        value: {
          type_of_file: this.form.file.name,
          encrypts_password: '',
          receiver_address: this.form.receiverPublicKey,
          sender_address: this.form.senderPublicKey,
          hash_of_file: fileHash,
        },
        type: '1',
      })
      await api.postOperations(opts)
    },

    cleanForm () {
      this.form.file = null
      this.form.receiverPublicKey = ''
      this.form.senderPublicKey = ''
      this.form.senderPrivateKey = ''
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.upload-file-page__form {
  width: 70rem;
  max-width: 70rem;
}

.upload-file-page__actions {
  margin-top: 4.5rem;
  display: flex;
  justify-content: space-between;
}

.upload-file-page__button-arrow {
  font-size: 1.4rem;
}

.upload-file-page__button-text {
  font-size: 1.4rem;

  &--next {
    margin-right: 1rem;
  }

  &--prev {
    margin-left: 1rem;
  }
}

.upload-file-page__header {
  font-size: 2.4rem;
  font-weight: 500;
  margin-bottom: 3.3rem;
}

.upload-file-page__input {
  margin-top: 3.3rem;
}

.upload-file-page__button-step[disabled] {
  color: #585d61;
  cursor: not-allowed;
}

.upload-file-page__steps {
  width: 70rem;
  max-width: 70rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.4rem;
  position: relative;

  &:before {
    content: '';
    width: 100%;
    height: 0.1rem;
    background: #788085;
    position: absolute;
    left: 0;
    top: 50%;
  }
}

.upload-file-page__point {
  width: 0.8rem;
  height: 0.8rem;
  background: #788085;
  border-radius: 50%;
  z-index: 1;

  &--current {
    width: 2rem;
    height: 2rem;
    background: #000000;
  }
}
</style>

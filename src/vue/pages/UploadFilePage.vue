<template>
  <div class="upload-file-page">
    <div class="app__content-block upload-file-page__form">
      <template v-if="currentStep === STEPS.step1">
        <div class="upload-file-page__firs-step">
          <file-field
            name="upload-file"
            v-model="form.file"
            :note="'drop-form.logo-note'"
            :placeholder="'drop-form.logo-lbl'"
            :min-width="120"
            :min-height="120"
            :max-size="20"
          />
          <app-button
            class="upload-file-page__generate-pass-btn"
            text="Upload file"
            @click="sendToBCH"
          />
        </div>
      </template>

      <template v-if="currentStep === STEPS.step2">
        <div class="upload-file-page__second-step">
          <h1 class="upload-file-page__header">
            {{ 'Generate password' }}
          </h1>
          <!-- <app-button
            class="upload-file-page__generate-pass-btn"
            text="Generate"
            @click="encodeAES"
          /> -->

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
            {{ 'Upload to IPFS' }}
          </h1>

          <app-button
            class="upload-file-page__generate-pass-btn"
            text="Upload file"
            @click="uploadToIPFS"
          />
        </div>
      </template>

      <div class="upload-file-page__actions">
        <button
          class="upload-file-page__button-step"
          :disabled="currentStep === STEPS.step1"
          type="button"
          @click="prevStep"
        >
          <i class="mdi mdi-arrow-left upload-file-page__button-arrow" />
          <span
            class="
            upload-file-page__button-text
            upload-file-page__button-text--prev
          ">
            {{ 'Prev' }}
          </span>
        </button>
        <button
          class="upload-file-page__button-step"
          :disabled="currentStep === STEPS.step4"
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
  </div>
</template>

<script>
import FileField from '@/vue/fields/FileField'
import InputField from '@/vue/fields/InputField'

import generatePass from 'generate-password'
import cryptoJs from 'crypto-js'
import { sharedKey } from 'curve25519-js'
import { u8aToHex, hexToU8a } from '@polkadot/util'
import { IPFS_URL, ipfs, api } from '@api'
import { base } from '@tokend/js-sdk'
// import { FileUtil } from '@/js/helpers/file.util'
// import ipfsApi from 'ipfs-http-client'
// import axios from 'axios'
// import rand from 'csprng'

const STEPS = {
  step1: 1,
  step2: 2,
  step3: 3,
  step4: 4,
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
    STEPS,
  }),

  methods: {
    loadDocument () {
      // function saveData(blob, fileName) // does the same as FileSaver.js
      // {
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'

      // let url = window.URL.createObjectURL('https://gateway.ipfs.io/ipfs/QmSwuDnhhDHGKmW1UV3uAfc5Vkp5UMimfcwtM8y7DXYEmV')
      a.href = 'https://gateway.ipfs.io/ipfs/QmSwuDnhhDHGKmW1UV3uAfc5Vkp5UMimfcwtM8y7DXYEmV'
      a.download = 'this.form.file.name'
      a.click()
      window.URL.revokeObjectURL('https://gateway.ipfs.io/ipfs/QmSwuDnhhDHGKmW1UV3uAfc5Vkp5UMimfcwtM8y7DXYEmV')
      // }
    },

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

    async uploadToIPFS () {
      try {
        await this.encodeAES()
        const ipfsResponse = await ipfs.add(this.encryptFile)
        console.log(ipfsResponse)
        const ipfsFileLink = IPFS_URL + ipfsResponse.path
        console.log(ipfsFileLink)
      } catch (e) {
        console.error(e)
      }
    },

    prevStep () { --this.currentStep },

    nextStep () { ++this.currentStep },

    generatePassword () {
      this.form.password = generatePass.generate({
        length: 20,
        numbers: true,
      })
    },

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
      this.encryptFile = cryptoJs.AES.encrypt(file, u8aToHex(key)).toString()
    },

    decodeAES () {
      const key = sharedKey(
        hexToU8a(this.form.senderPrivateKey),
        hexToU8a(this.form.receiverPublicKey)
      )

      const decrypted = cryptoJs.AES
        .decrypt(this.encryptFile.toString(), u8aToHex(key))
        .toString(cryptoJs.enc.Latin1)

      const ddd = this.dataURLtoFile(decrypted)

      let a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'

      let url = window.URL.createObjectURL(ddd)
      a.href = url
      a.download = 'thisEncFiel.jpeg'
      a.click()
      window.URL.revokeObjectURL(url)
    },

    dataURLtoFile (dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new File([u8arr], filename, { type: mime })
    },

    async sendToBCH () {
      const opts = base.CreateDataBuilder.createData({
        value: {
          type_of_file: 'jpeg',
          encrypts_password: '',
          receiver_address: '0x5e2220a1a6bd23989973b9994e8cc0f934bca6951609c36fb025f68153280327',
          sender_address: '0xba9a3e01060fef326a69fd1b89c08b68141677fc1b392f57571153685c573006',
          hash_of_file: 'QmSwuDnhhDHGKmW1UV3uAfc5Vkp5UMimfcwtM8y7DXYEmV',
        },
        type: '1',
      })

      console.log(opts)
      const res = await api.postOperations(opts)
      console.log(res)
    },

    async getFiles () {
      const data = await api.getWithSignature('/integrations/password/receiver/0x5e2220a1a6bd23989973b9994e8cc0f934bca6951609c36fb025f68153280327')
      console.log(data)
    },

  },
}

// import encUtf8 from 'crypto-js/enc-utf8'
// let decoder = new TextDecoder('string')
// const encoder = new TextEncoder()
// console.log(encoder)
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
</style>

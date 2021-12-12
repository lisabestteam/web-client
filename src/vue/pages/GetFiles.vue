<template>
  <div class="get-files-page">
    <div class="app__content-block get-files-page__form">
      <div class="get-files-page__second-step">
        <input-field
          v-model="form.privateKey"
          class="get-files-page__input"
          name="change-password-current-password"
          label="My secret key"
        />

        <input-field
          v-model="form.publicKey"
          class="get-files-page__input"
          name="change-password-current-password"
          label="My public key"
        />

        <app-button
          class="get-files-page__generate-pass-btn"
          text="Receive"
          @click="getFiles"
        />
      </div>
    </div>

    <template v-if="isFirstFileLoad">
      <div class="app__content-block get-files-page__files-wrap">
        <template v-if="isFilesLoaded">
          <h1 class="get-files-page__available-files-header">
            {{ 'Available files' }}
          </h1>
          <template v-if="filesList.length">
            <button
              v-for="(file, id) in filesList"
              :key="id"
              class="get-files-page__file-btn"
              type="button"
              @click="downloadFileById(id)"
            >
              <i class="mdi mdi-file-outline get-files-page__file-icon" />
              <p class="get-files-page__file-name">
                {{ file.name }}
              </p>
              <i class="mdi mdi-download get-files-page__file-download-icon" />
            </button>
          </template>
          <template v-else>
            <p>
              {{ 'No files available' }}
            </p>
          </template>
        </template>
        <template v-else>
          <p>
            {{ 'Loading...' }}
          </p>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import InputField from '@/vue/fields/InputField'

import cryptoJs from 'crypto-js'
import { sharedKey } from 'curve25519-js'
import { u8aToHex, hexToU8a } from '@polkadot/util'
import { api } from '@api'

export default {
  name: 'upload-fiele',

  components: { InputField },

  data: _ => ({
    currentStep: 1,
    form: {
      publicKey: '0x5e2220a1a6bd23989973b9994e8cc0f934bca6951609c36fb025f68153280327',
      privateKey: '0x188f41691377c2bb5a2d945502c43d1ce92db8c4c7e2c4ff000c0986aaa3705a',
    },
    filesList: [],
    isFilesLoaded: false,
    isFirstFileLoad: false,
  }),

  methods: {
    async getFiles () {
      try {
        this.isFilesLoaded = false
        this.isFirstFileLoad = true
        const { data } = await api.getWithSignature(`/integrations/password/receiver/${this.form.publicKey}`)
        this.filesList = await Promise.all(data.map(async (i) => {
          const file = await this.getIpsFile(i.hashOfFile, i.senderAddress,)
          return {
            file,
            name: i.typeOfFile,
          }
        }))
        this.isFilesLoaded = true
      } catch (e) {
        console.error(e)
      }
    },

    async getIpsFile (hash, senderAddress) {
      const response = await fetch(`https://gateway.ipfs.io/ipfs/${hash}`)
      const { encFile } = await response.json()
      return this.decodeFile(encFile, senderAddress)
    },

    decodeFile (encFile, senderAddress) {
      const key = sharedKey(
        hexToU8a(this.form.privateKey),
        hexToU8a(senderAddress)
      )

      const decrypted = cryptoJs.AES
        .decrypt(encFile, u8aToHex(key))
        .toString(cryptoJs.enc.Latin1)

      return this.dataURLtoFile(decrypted)
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

    downloadFileById (id) {
      const currentFile = this.filesList[id]
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'

      let url = window.URL.createObjectURL(currentFile.file)
      a.href = url
      a.download = currentFile.name
      a.click()
      window.URL.revokeObjectURL(url)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

$col-file-button-hover: #f4f4f4;

.get-files-page__form {
  width: 70rem;
  max-width: 70rem;
}

.get-files-page__input {
  & + & {
    margin-top: 3.3rem;
  }
}

.get-files-page__generate-pass-btn {
  margin-top: 3rem;
}

.get-files-page__available-files-header {
  font-size: 2.4rem;
  font-weight: normal;
  margin-bottom: 0.8rem;
}

.get-files-page__files-wrap {
  margin-top: 3rem;
  max-width: 70rem;
}

.get-files-page__file-btn {
  display: flex;
  align-items: center;
  padding: 1.8rem;
  border-radius: 0.8rem;
  width: 100%;

  &:hover {
    background: $col-file-button-hover;
  }
}

.get-files-page__file-icon {
  font-size: 2rem;
  margin-right: 0.8rem;
}

.get-files-page__file-name {
  font-size: 1.6rem;
}

.get-files-page__file-download-icon {
  margin-left: auto;
  font-size: 2rem;
}
</style>

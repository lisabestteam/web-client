<template>
  <div class="file-field">
    <div
      v-if="label"
      class="file-field__label"
    >
      {{ label }}
    </div>

    <div
      class="file-field__content"
      :class="{
        'file-field__content--disabled': $attrs.disabled,
        'file-field__content--error': errorMessage,
        'file-field__content--highlighted': isFileDragged
      }"
    >
      <template v-if="document">
        <button
          v-if="!$attrs.disabled"
          :title="'file-field.reset-btn-hint'"
          class="file-field__reset-btn"
          type="button"
          @click="reset"
        >
          <i class="mdi mdi-close file-field__reset-icon" />
        </button>

        <div
          v-if="documentUrl && isImageSelected"
          class="file-field__img-preview-wrp"
        >
          <img class="file-field__img-preview" :src="documentUrl">
        </div>

        <div v-else class="file-field__icon-preview-wrp">
          <i class="mdi mdi-file file-field__icon-preview" />
        </div>

        <div class="file-field__selected-file">
          {{ `file-field.selected-file (${document.name })` }}
        </div>
      </template>

      <div class="file-field__inner">
        <template v-if="!$attrs.disabled">
          <i
            v-if="!document"
            class="mdi file-field__icon"
            :class="isFileDragged ? 'mdi-file-plus' : 'mdi-cloud-upload'"
          />

          <div class="file-field__text">
            <p class="file-field__title">
              <template v-if="placeholder">
                {{ placeholder }}
              </template>

              <template v-else-if="isFileDragged">
                {{ 'file-field.drop-file-title' }}
              </template>

              <template v-else-if="document">
                {{ 'file-field.upload-another-file-title' }}
              </template>

              <template v-else>
                {{ 'file-field.upload-file-title' }}
              </template>
            </p>

            <div class="file-field__note">
              {{ note }}
            </div>
          </div>
        </template>

        <template v-else-if="!document">
          <i class="mdi mdi-file-hidden file-field__icon" />

          <div class="file-field__text">
            <p class="file-field__title">
              {{ 'file-field.no-file-selected-title' }}
            </p>
          </div>
        </template>
      </div>

      <!--
        title is set to empty string to avoid ambiguity concerning
        the selected file. When we set document programmatically
        (e.g. when dispaying files uploaded before), file input title
        will be `No file chosen`, cause JavaScript doesn't allow to
        select the file from the code.
      -->
      <input
        v-bind="$attrs"
        type="file"
        class="file-field__input"
        title=""
        @change="onChange"
        @dragenter="isFileDragged = true"
        @dragleave="isFileDragged = false"
        @drop="isFileDragged = false"
      >
    </div>

    <div
      class="file-field__err-mes"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { FileUtil, FileNotPresentInEventError } from '@/js/helpers/file.util'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

const MAX_FILE_MEGABYTES = 32
const IMAGE_FILE_EXTENSIONS = ['jpg', 'png', 'jpeg', 'gif']

export default {
  name: 'file-field',
  props: {
    value: { type: DocumentContainer, default: null },
    label: { type: String, default: '' },
    documentType: { type: String, default: 'default' },
    fileExtensions: { type: Array, default: _ => IMAGE_FILE_EXTENSIONS },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' },
    errorMessage: { type: String, default: undefined },
    minWidth: { type: Number, default: 0 },
    minHeight: { type: Number, default: 0 },
    placeholder: { type: String, default: '' },
  },

  data: _ => ({
    document: null,
    isFileDragged: false,
    documentUrl: '',
  }),

  computed: {
    maxSizeBytes () {
      return this.maxSize * 1024 * 1024
    },

    isImageSelected () {
      const mimeType = this.document.mimeType
      return mimeType && mimeType.includes('image')
    },
  },

  watch: {
    'value': function (value) {
      this.document = value
      if (value) this.loadDocumentUrl(value)
    },
  },

  async created () {
    try {
      if (this.value) {
        this.document = this.value
        await this.loadDocumentUrl(this.value)
      }
    } catch (e) {
      console.error(e)
    }
  },

  methods: {
    async loadDocumentUrl (document) {
      if (document.key) {
        this.documentUrl = await document.getPrivateUrl()
      } else {
        this.documentUrl = await FileUtil.getDataUrl(document.file)
      }
    },

    async onChange (event) {
      try {
        const file = FileUtil.getFileFromEvent(event)

        if (await this.validateFile(file)) {
          this.documentUrl = await FileUtil.getDataUrl(file)
          this.document = new DocumentContainer({
            mimeType: file.type || 'application/octet-stream',
            type: this.documentType,
            name: file.name,
            file: file,
          })
          this.$emit('input', this.document)
        }
      } catch (e) {
        if (e instanceof FileNotPresentInEventError) {
          this.reset()
        } else {
          console.error(e)
        }
      }
    },

    async validateFile (file) {
      if (!this.isValidFileSize(file)) {
        console.error({
          messageId: 'file-field.max-size-exceeded-err',
          messageArgs: { maxSize: this.maxSize },
        })
        return false
      }

      if (!(await this.isValidFileDimensions(file))) {
        console.error({
          messageId: 'file-field.invalid-dimensions-err',
          messageArgs: {
            minHeight: this.minHeight,
            minWidth: this.minWidth,
          },
        })
        return false
      }

      return true
    },

    reset () {
      this.$el.querySelector('input').value = ''
      this.document = null
      this.documentUrl = ''
      this.$emit('input', this.document)
    },

    isValidFileSize (file) {
      return file.size <= this.maxSizeBytes
    },

    // isValidFileType (file) {
    //   return Boolean(this.fileExtensions
    //     .find(item => item.toUpperCase() === this.getFileExtension(file))
    //   )
    // },

    async isValidFileDimensions (file) {
      if (!file.type.includes('image')) {
        return true
      }

      try {
        const img = await FileUtil.readImage(file)
        return img.width >= this.minWidth &&
          img.height >= this.minHeight
      } catch (e) {
        console.error(e)
        return false
      }
    },

    getFileExtension (file) {
      return file.name.split('.').pop().toUpperCase()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$z-reset-btn: 1;

.file-field {
  display: flex;
  flex-direction: column;
}

.file-field__label {
  display: block;
  margin-bottom: 0.5rem;
  position: relative;
  pointer-events: none;
  color: $field-color-label;
  max-width: 100%;

  @include label-font-sizes;
}

.file-field__content {
  background-color: $file-field-background-color;
  width: 100%;
  text-align: center;
  position: relative;
  min-height: 9.8rem;
  padding: $field-input-padding;

  @include material-border(
    $field-color-focused,
    $field-color-unfocused,
  );
}

.file-field__content--error {
  border-color: $field-color-error;
}

.file-field__content--highlighted {
  background-color: $file-field-drop-bg-color;
  border-color: $field-color-text;
}

.file-field__content--disabled {
  filter: grayscale(100%);
}

.file-field__icon {
  color: $file-field-note-color;
  font-size: 4.2rem;
}

.file-field__img-preview-wrp {
  width: 100%;
}

.file-field__img-preview {
  padding: 0 5rem;
  object-fit: contain;
  width: 100%;
  height: 15rem;
  margin: auto;
}

.file-field__reset-btn {
  position: absolute;
  z-index: $z-reset-btn;
  top: 1rem;
  right: 1rem;
  min-width: 3rem;
  min-height: 3rem;
  color: $field-placeholer-color;
}

.file-field__reset-icon {
  font-size: 2.4rem;

  &:before {
    font-weight: 700;
    vertical-align: middle;
  }
}

.file-field__icon-preview {
  font-size: 8rem;
}

.file-field__selected-file {
  color: $file-field-note-color;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.file-field__inner {
  overflow: hidden;
}

.file-field__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.file-field__title {
  color: $field-placeholer-color;

  @include text-font-sizes;
}

.file-field__note {
  color: $file-field-note-color;
  margin-top: 0.6rem;
  font-size: 1.2rem;
  line-height: 1.2;
}

.file-field__input {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  opacity: 0;
  height: 100%;
  width: 100%;
}

.file-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

</style>

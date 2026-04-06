<template>
  <div
    class="secure-img-wrap"
    :style="{ position: 'relative', display: 'inline-block', userSelect: 'none' }"
    @contextmenu.prevent
    @dragstart.prevent
    @mousedown.prevent
    @pointerdown.prevent
    @touchstart.prevent
    @touchend.prevent
    @selectstart.prevent
  >
    <img
      :src="blobUrl || nativeUrl || fallback"
      :alt="alt"
      :class="['secure-img', imgClass]"
      :style="imgStyle"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
      draggable="false"
      referrerpolicy="no-referrer"
    />
    <div
      class="secure-overlay"
      :style="{
        position: 'absolute',
        inset: 0,
        background: 'transparent',
        pointerEvents: 'auto'
      }"
      aria-hidden="true"
    />
  </div>
</template>

<script>
import { getBlobUrl, revokeObjectUrlSafe, resolveImageUrl } from '@/utils/imageCache'

export default {
  name: 'SecureImage',
  props: {
    src: { type: String, required: true },
    cacheKey: { type: String, required: true },
    ttlMs: { type: Number, default: 5 * 60 * 1000 },
    alt: { type: String, default: '' },
    fallback: { type: String, default: '/assets/img/0835823.png' },
    imgClass: { type: String, default: '' },
    imgStyle: { type: String, default: '' },
    width: { type: [String, Number], default: undefined },
    height: { type: [String, Number], default: undefined },
    headers: { type: Object, default: () => ({}) },
    mode: { type: String, default: 'native' }
  },
  data() {
    return {
      blobUrl: null,
      nativeUrl: null,
      lastSrc: null
    }
  },
  async mounted() {
    if (this.mode === 'blob') {
      await this.loadImage()
    } else {
      this.updateNative()
    }
  },
  beforeUnmount() {
    revokeObjectUrlSafe(this.blobUrl)
  },
  watch: {
    src: {
      immediate: false,
      async handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          revokeObjectUrlSafe(this.blobUrl)
          this.blobUrl = null
          if (this.mode === 'blob') {
            await this.loadImage()
          } else {
            this.updateNative()
          }
        }
      }
    }
  },
  methods: {
    async loadImage() {
      if (!this.src) return
      try {
        const objUrl = await getBlobUrl(this.src, this.cacheKey, this.ttlMs, this.headers)
        this.blobUrl = objUrl
      } catch (err) {
        // Keep fallback visible on error; avoid logging URLs or detailed errors
        this.blobUrl = null
      }
    },
    updateNative() {
      this.nativeUrl = resolveImageUrl(this.src)
    }
  }
}
</script>
<style scoped>
.secure-img {
  pointer-events: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
}
</style>

<template>
  <div class="slider-captcha-container" :class="{ 'verified': isVerified }">
    <div class="slider-track">
      <div class="slider-text" :style="{ opacity: isVerified ? 0 : 1 }">Geser untuk verifikasi</div>
      <div 
        class="slider-thumb" 
        :style="{ left: thumbPosition + 'px' }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <span v-if="!isVerified" class="arrow-icon">>></span>
        <span v-else class="check-icon">✓</span>
      </div>
      <div class="slider-fill" :style="{ width: thumbPosition + 'px' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['verify'])

const isVerified = ref(false)
const isDragging = ref(false)
const thumbPosition = ref(0)
const maxSlide = ref(0)
const startX = ref(0)

const startDrag = (e) => {
  if (isVerified.value) return
  isDragging.value = true
  startX.value = (e.touches ? e.touches[0].clientX : e.clientX) - thumbPosition.value
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const newPos = clientX - startX.value
  
  if (newPos < 0) {
    thumbPosition.value = 0
  } else if (newPos > maxSlide.value) {
    thumbPosition.value = maxSlide.value
  } else {
    thumbPosition.value = newPos
  }
}

const stopDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  if (thumbPosition.value >= maxSlide.value - 5) { // Threshold
    isVerified.value = true
    thumbPosition.value = maxSlide.value
    emit('verify', true)
  } else {
    // Reset
    const animateReset = () => {
      if (thumbPosition.value > 0) {
        thumbPosition.value -= 10
        requestAnimationFrame(animateReset)
      } else {
        thumbPosition.value = 0
      }
    }
    animateReset()
    emit('verify', false)
  }
  
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

onMounted(() => {
  const track = document.querySelector('.slider-track')
  if (track) {
    maxSlide.value = track.clientWidth - 50 // 50 is thumb width
  }
  // Recalculate on resize
  window.addEventListener('resize', () => {
    if (track) maxSlide.value = track.clientWidth - 50
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.slider-captcha-container {
  width: 100%;
  margin-bottom: 20px;
  user-select: none;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: #f0f0f0;
  border-radius: 25px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.slider-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1;
}

.slider-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 48px; /* -2px for border */
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: background-color 0.3s;
  border: 1px solid #d0d0d0;
}

.slider-captcha-container.verified .slider-thumb {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.arrow-icon {
  font-weight: bold;
  color: #666;
}

.check-icon {
  font-weight: bold;
  font-size: 18px;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #e8f5e9; /* Light green */
  z-index: 2;
  transition: background-color 0.3s;
}

.slider-captcha-container.verified .slider-fill {
  background-color: #4CAF50;
  width: 100% !important; /* Fill completely on verify */
  transition: width 0.3s, background-color 0.3s;
}

.slider-captcha-container.verified .slider-text {
  color: white;
  opacity: 1 !important;
  content: 'Terverifikasi';
  z-index: 4;
}

/* Optional: Change text content when verified via CSS pseudo-element if needed, 
   but simpler to keep text empty or change component logic */
</style>
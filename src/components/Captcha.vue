<template>
  <div class="captcha-container">
    <canvas ref="canvasRef" :width="width" :height="height" class="captcha-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  length: { type: Number, default: 6 },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 40 }
})

const canvasRef = ref(null)
const currentCode = ref('')

const drawNoise = (ctx, w, h) => {
  for (let i = 0; i < 10; i++) {
    ctx.strokeStyle = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
    ctx.beginPath()
    ctx.moveTo(Math.random()*w, Math.random()*h)
    ctx.lineTo(Math.random()*w, Math.random()*h)
    ctx.stroke()
  }
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
    ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1)
  }
}

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < props.length; i++) {
    code += chars[Math.floor(Math.random()*chars.length)]
  }
  currentCode.value = code
}

const render = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = props.width
  const h = props.height
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  drawNoise(ctx, w, h)
  const baseX = 10
  const y = h/2 + 8
  for (let i = 0; i < currentCode.value.length; i++) {
    const ch = currentCode.value[i]
    const angle = (Math.random() * 0.6) - 0.3
    ctx.save()
    ctx.translate(baseX + i * (w - 20) / props.length, y)
    ctx.rotate(angle)
    ctx.font = `${Math.floor(h/2)}px sans-serif`
    ctx.fillStyle = '#333'
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  }
}

const refresh = () => { generateCode(); render() }

onMounted(() => { refresh() })

defineExpose({
  getCode: () => currentCode.value,
  refresh
})
</script>

<style scoped>
.captcha-container {
  display: inline-flex;
  align-items: center;
}
.captcha-canvas {
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 4px;
}
/* refresh removed */
</style>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUIState } from './utils/useUIState'
import AboutMeChild from './ui/aboutmechild.vue'

const { isAboutOpen, closeAbout } = useUIState()

// --- Tilt ---
const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const scale = ref(1)
const rotateAmplitude = 10
const scaleOnHover = 1.02

function handleMouseTilt(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  rotateX.value = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -rotateAmplitude
  rotateY.value = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * rotateAmplitude
}

// --- Pixel Canvas ---
const gap = 6
const speed = 25
const colors = '#86efac,#4ade80,#22c55e,#16a34a'

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  if (value <= 0 || reducedMotion) return 0
  if (value >= 100) return 100 * 0.001
  return value * 0.001
}

class Pixel {
  width: number; height: number; ctx: CanvasRenderingContext2D
  x: number; y: number; color: string; speed: number; size: number
  sizeStep: number; minSize: number; maxSizeInteger: number; maxSize: number
  delay: number; counter: number; counterStep: number
  isIdle: boolean; isReverse: boolean; isShimmer: boolean

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, color: string, spd: number, delay: number) {
    this.width = canvas.width; this.height = canvas.height; this.ctx = context
    this.x = x; this.y = y; this.color = color
    this.speed = (Math.random() * 0.8 + 0.1) * spd
    this.size = 0; this.sizeStep = Math.random() * 0.4; this.minSize = 0.5
    this.maxSizeInteger = 2; this.maxSize = Math.random() * 1.5 + 0.5
    this.delay = delay; this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false; this.isReverse = false; this.isShimmer = false
  }

  draw() {
    const offset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x + offset, this.y + offset, this.size, this.size)
  }

  appear() {
    this.isIdle = false
    if (this.counter <= this.delay) { this.counter += this.counterStep; return }
    if (this.size >= this.maxSize) this.isShimmer = true
    if (this.isShimmer) this.shimmer()
    else this.size += this.sizeStep
    this.draw()
  }

  disappear() {
    this.isShimmer = false; this.counter = 0
    if (this.size <= 0) { this.isIdle = true; return }
    this.size -= 0.1
    this.draw()
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true
    else if (this.size <= this.minSize) this.isReverse = false
    this.isReverse ? (this.size -= this.speed) : (this.size += this.speed)
  }
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const pixelsRef = ref<Pixel[]>([])
const animationRef = ref<number | null>(null)
const timePreviousRef = ref(performance.now())

const initPixels = () => {
  if (!cardRef.value || !canvasRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const w = Math.floor(rect.width)
  const h = Math.floor(rect.height)
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  canvasRef.value.width = w; canvasRef.value.height = h
  canvasRef.value.style.width = `${w}px`; canvasRef.value.style.height = `${h}px`
  const colorsArr = colors.split(',')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const pxs: Pixel[] = []
  for (let x = 0; x < w; x += gap) {
    for (let y = 0; y < h; y += gap) {
      const color = colorsArr[Math.floor(Math.random() * colorsArr.length)] || '#22c55e'
      const dx = x - w / 2; const dy = y - h / 2
      const delay = reducedMotion ? 0 : Math.sqrt(dx * dx + dy * dy)
      pxs.push(new Pixel(canvasRef.value, ctx, x, y, color, getEffectiveSpeed(speed, reducedMotion), delay))
    }
  }
  pixelsRef.value = pxs
}

const doAnimate = (fnName: 'appear' | 'disappear') => {
  animationRef.value = requestAnimationFrame(() => doAnimate(fnName))
  const now = performance.now()
  const passed = now - timePreviousRef.value
  if (passed < 1000 / 60) return
  timePreviousRef.value = now - (passed % (1000 / 60))
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  let allIdle = true
  const pixels = pixelsRef.value
  for (const px of pixels) {
    fnName === 'appear' ? px.appear() : px.disappear()
    if (!px.isIdle) allIdle = false
  }
  if (allIdle && animationRef.value !== null) {
    cancelAnimationFrame(animationRef.value)
    animationRef.value = null
  }
}

const handleAnimation = (name: 'appear' | 'disappear') => {
  if (animationRef.value !== null) { cancelAnimationFrame(animationRef.value); animationRef.value = null }
  animationRef.value = requestAnimationFrame(() => doAnimate(name))
}

function handleMouseEnter() { scale.value = scaleOnHover; handleAnimation('appear') }
function handleMouseLeave() { scale.value = 1; rotateX.value = 0; rotateY.value = 0; handleAnimation('disappear') }

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  initPixels()
  if (cardRef.value) {
    resizeObserver = new ResizeObserver(initPixels)
    resizeObserver.observe(cardRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (animationRef.value !== null) cancelAnimationFrame(animationRef.value)
})
</script>

<template>
    <div class="aboutme-container" :class="{ 'is-open': isAboutOpen }">
      <div 
        ref="cardRef"
        class="aboutme-glass glass-card"
        @mousemove="handleMouseTilt"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :style="{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
        }"
      >
        <!-- Pixel Canvas -->
        <canvas ref="canvasRef" class="pixel-canvas"></canvas>
        <div class="pixel-card-overlay"></div>

        <div class="aboutme-content">
          <button class="close-btn" @click.stop="closeAbout">×</button>
          
          <div class="profile-image-placeholder">
            <img src="/cv.png" alt="Kafkha" class="profile-img" />
          </div>

          <div class="profile-info">
            <h2>Juan Manuel Crudo</h2>
            <span class="profile-title">Software Developer · Cali, Colombia</span>
          </div>
          <p>
            Freelancer con 2+ años construyendo productos reales. Full stack moderno, visión artificial
            y automatización con IA integrada al flujo de trabajo.
          </p>
          <div class="skills">
            <span>Vue.js</span>
            <span>Node.js</span>
            <span>TypeScript</span>
            <span>React Native</span>
            <span>Supabase</span>
            <span>Docker</span>
            <span>Electron</span>
            <span>YOLO · CV</span>
          </div>
        </div>
      </div>
    </div>
    
    <AboutMeChild :show="isAboutOpen" />
</template>

<style scoped>
.aboutme-container {
  position: fixed;
  top: 50%;
  left: 3rem;
  transform: translateY(-50%) translateX(-120%);
  width: 350px;
  max-width: calc(100vw - 6rem); /* Margin on both sides */
  height: auto;
  z-index: 200;
  opacity: 0;
  will-change: transform, opacity;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  perspective: 1000px; /* needed for 3d tilt */
}

.aboutme-container.is-open {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
}

.aboutme-glass {
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: auto;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.1s ease-out;
  position: relative; /* Ensure canvas positioning works */
}

/* Pixel Card Styles */
.pixel-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.pixel-card-overlay {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #09090b 20%, transparent 85%);
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1);
  z-index: 1;
  pointer-events: none;
}

.aboutme-glass:hover .pixel-card-overlay {
  opacity: 0.6; /* Slight overlay on hover */
}

.aboutme-content {
  padding: 2rem;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  z-index: 2; /* Ensure content is above pixels */
}

.profile-image-placeholder {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 2px solid rgba(74, 222, 128, 0.35);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
  margin-bottom: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 1.4rem;
  background: linear-gradient(135deg, #fff, #86efac);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.profile-title {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.03em;
}

p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  font-size: 0.88rem;
}

.skills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.skills span {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}


</style>

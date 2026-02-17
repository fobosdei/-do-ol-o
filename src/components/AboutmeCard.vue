<script setup lang="ts">
import { useUIState } from './utils/useUIState'

import AboutMeChild from './ui/aboutmechild.vue'

import { ref, onMounted, onBeforeUnmount } from 'vue'

const { isAboutOpen, closeAbout } = useUIState()

// --- Tilted Card Logic ---
const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const scale = ref(1)

const rotateAmplitude = 10
const scaleOnHover = 1.02

function handleMouseTilt(e: MouseEvent) {
  if (!cardRef.value) return

  const rect = cardRef.value.getBoundingClientRect()
  const offsetX = e.clientX - rect.left - rect.width / 2
  const offsetY = e.clientY - rect.top - rect.height / 2

  const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
  const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

  rotateX.value = rotationX
  rotateY.value = rotationY
}

// --- Pixel Card Logic ---
// Configuration
const gap = 6
const speed = 25
// Colors matching the purple/violet theme
const colors = '#a78bfa,#8b5cf6,#6d28d9,#5227FF' 

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0
  const max = 100
  const throttle = 0.001

  if (value <= min || reducedMotion) {
    return min
  } else if (value >= max) {
    return max * throttle
  } else {
    return value * throttle
  }
}

class Pixel {
  width: number
  height: number
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  color: string
  speed: number
  size: number
  sizeStep: number
  minSize: number
  maxSizeInteger: number
  maxSize: number
  delay: number
  counter: number
  counterStep: number
  isIdle: boolean
  isReverse: boolean
  isShimmer: boolean

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number
  ) {
    this.width = canvas.width
    this.height = canvas.height
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.size = 0
    this.sizeStep = Math.random() * 0.4
    this.minSize = 0.5
    this.maxSizeInteger = 2
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
    this.isIdle = false
    this.isReverse = false
    this.isShimmer = false
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
  }

  appear() {
    this.isIdle = false
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }
    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }
    this.draw()
  }

  disappear() {
    this.isShimmer = false
    this.counter = 0
    if (this.size <= 0) {
      this.isIdle = true
      return
    } else {
      this.size -= 0.1
    }
    this.draw()
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }
    if (this.isReverse) {
      this.size -= this.speed
    } else {
      this.size += this.speed
    }
  }
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const pixelsRef = ref<Pixel[]>([])
const animationRef = ref<number | null>(null)
const timePreviousRef = ref(performance.now())

const initPixels = () => {
  if (!cardRef.value || !canvasRef.value) return

  const rect = cardRef.value.getBoundingClientRect()
  const width = Math.floor(rect.width)
  const height = Math.floor(rect.height)
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  canvasRef.value.width = width
  canvasRef.value.height = height
  canvasRef.value.style.width = `${width}px`
  canvasRef.value.style.height = `${height}px`

  const colorsArray = colors.split(',')
  const pxs = []
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  for (let x = 0; x < width; x += parseInt(gap.toString(), 10)) {
    for (let y = 0; y < height; y += parseInt(gap.toString(), 10)) {
      const color = colorsArray[Math.floor(Math.random() * colorsArray.length)] || '#5227FF'

      const dx = x - width / 2
      const dy = y - height / 2
      const distance = Math.sqrt(dx * dx + dy * dy)
      const delay = reducedMotion ? 0 : distance
      
      pxs.push(new Pixel(canvasRef.value, ctx, x, y, color, getEffectiveSpeed(speed, reducedMotion), delay))
    }
  }
  pixelsRef.value = pxs
}

const doAnimate = (fnName: 'appear' | 'disappear') => {
  animationRef.value = requestAnimationFrame(() => doAnimate(fnName))
  const timeNow = performance.now()
  const timePassed = timeNow - timePreviousRef.value
  const timeInterval = 1000 / 60

  if (timePassed < timeInterval) return
  timePreviousRef.value = timeNow - (timePassed % timeInterval)

  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  let allIdle = true
  for (let i = 0; i < pixelsRef.value.length; i++) {
    const pixel = pixelsRef.value[i]
    if (!pixel) continue

    if (fnName === 'appear') pixel.appear()
    else if (fnName === 'disappear') pixel.disappear()
    
    if (!pixel.isIdle) {
      allIdle = false
    }
  }
  if (allIdle) {
    if (animationRef.value !== null) {
      cancelAnimationFrame(animationRef.value)
      animationRef.value = null
    }
  }
}

const handleAnimation = (name: 'appear' | 'disappear') => {
  if (animationRef.value !== null) {
    cancelAnimationFrame(animationRef.value)
    animationRef.value = null
  }
  animationRef.value = requestAnimationFrame(() => doAnimate(name))
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  initPixels()
  if (cardRef.value) {
    resizeObserver = new ResizeObserver(() => {
      initPixels()
    })
    resizeObserver.observe(cardRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
  if (animationRef.value !== null) cancelAnimationFrame(animationRef.value)
})

// Combined Event Handlers
function handleMouse(e: MouseEvent) {
  handleMouseTilt(e)
}

function handleMouseEnter() {
  scale.value = scaleOnHover
  handleAnimation('appear')
}

function handleMouseLeave() {
  scale.value = 1
  rotateX.value = 0
  rotateY.value = 0
  handleAnimation('disappear')
}
</script>

<template>
    <div class="aboutme-container" :class="{ 'is-open': isAboutOpen }">
      <div 
        ref="cardRef"
        class="aboutme-glass glass-card"
        @mousemove="handleMouse"
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
            <div class="image-inner">
              <!-- Placeholder for user photo -->
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>

          <h2>Sobre Mí</h2>
          <p>
            Soy un desarrollador apasionado por crear experiencias web inmersivas y dinámicas. 
            Me encanta combinar diseño moderno con tecnología de vanguardia.
          </p>
          <div class="skills">
            <span>Vue.js</span>
            <span>Three.js</span>
            <span>TypeScript</span>
            <span>Design</span>
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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.image-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(160, 160, 255, 0.1), transparent 70%);
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

h2 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #fff, #a0a0ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
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

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUIState } from './utils/useUIState'
import LiquidGlass from './interfaces/liquidglass.vue'

const { isContactOpen, closeContact } = useUIState()

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
    this.maxSizeInteger = 2; this.maxSize = Math.random() * (2 - 0.5) + 0.5
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
  for (const px of pixelsRef.value) {
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

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/fobosdei',
    svg: `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>`
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/juan-manuel-fernandez-idrobo-11158736a',
    svg: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>`
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/juan_manuelfer?igsh=MWh1ZXpqc3FvdGgwdw==',
    svg: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>`
  }
]
</script>

<template>
  <div class="contact-container" :class="{ 'is-open': isContactOpen }">
    <div
      ref="cardRef"
      class="contact-glass-wrapper"
      @mousemove="handleMouseTilt"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :style="{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})` }"
    >
      <LiquidGlass
        :width="'100%'"
        :height="'auto'"
        :border-radius="30"
        :border-width="0.2"
        :opacity="0.15"
        :blur="6"
        :displace="0.5"
        :distortion-scale="10"
        mix-blend-mode="normal"
        class="contact-glass-surface"
      >
        <div class="contact-glass-inner">
          <canvas ref="canvasRef" class="pixel-canvas"></canvas>
          <div class="pixel-card-overlay"></div>

          <div class="contact-content">
        <button class="close-btn" @click.stop="closeContact">×</button>

        <div class="mail-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        <h2>Contáctame</h2>
        <p class="subtitle">¿Tienes un proyecto en mente? Hablemos.</p>

        <a href="mailto:manuelydrobo2004@gmail.com" class="email-btn">
          manuelydrobo2004@gmail.com
        </a>

        <div class="divider"></div>

        <div class="social-links">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            class="social-link"
            :title="s.label"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" v-html="s.svg"></svg>
          </a>
        </div>

        <p class="availability">
          <span class="dot"></span>
          Disponible para proyectos freelance
        </p>
          </div>
        </div>
      </LiquidGlass>
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  position: fixed;
  top: 50%;
  right: 3rem;
  transform: translateY(-50%) translateX(120%);
  width: 360px;
  max-width: calc(100vw - 6rem);
  height: auto;
  z-index: 200;
  opacity: 0;
  will-change: transform, opacity;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  perspective: 1000px;
}

.contact-container.is-open {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
}

.contact-glass-wrapper {
  width: 100%;
  height: auto;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.1s ease-out;
}

.contact-glass-surface {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.contact-glass-inner {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 30px;
}

.contact-glass-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  background: rgba(5, 5, 10, 0.55);
  border-radius: inherit;
  z-index: 0;
}

.pixel-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}

.pixel-card-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, #09090b 20%, transparent 85%);
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1);
  z-index: 1;
  pointer-events: none;
}

.contact-glass:hover .pixel-card-overlay {
  opacity: 0.6;
}

.contact-content {
  padding: 2rem;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
  z-index: 2;
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

.mail-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  box-shadow: 0 0 24px rgba(34, 197, 94, 0.15);
  margin-bottom: 0.25rem;
}

h2 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #fff, #86efac);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.5;
}

.email-btn {
  display: inline-block;
  padding: 0.65rem 1.2rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 50px;
  color: #86efac;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
  word-break: break-all;
}

.email-btn:hover {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(74, 222, 128, 0.55);
  box-shadow: 0 0 18px rgba(34, 197, 94, 0.2);
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.25rem 0;
}

.social-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.25s ease;
  text-decoration: none;
}

.social-link:hover {
  color: #fff;
  background: rgba(74, 222, 128, 0.12);
  border-color: rgba(74, 222, 128, 0.3);
  transform: scale(1.1);
}

.availability {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.7);
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

interface Props {
  position?: 'top' | 'bottom' | 'left' | 'right'
  strength?: number
  height?: string
  width?: string
  divCount?: number
  exponential?: boolean
  zIndex?: number
  opacity?: number
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
  target?: 'parent' | 'page'
  distortion?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  opacity: 1,
  curve: 'linear',
  target: 'parent',
  distortion: false
})

const CURVE_FUNCTIONS = {
  linear: (p: number) => p,
  bezier: (p: number) => p * p * (3 - 2 * p),
  'ease-in': (p: number) => p * p,
  'ease-out': (p: number) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
}

const getGradientDirection = (position: string): string => {
  const directions: Record<string, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  }
  return directions[position] || 'to bottom'
}

const blurDivs = computed(() => {
  const divs: { key: number; style: CSSProperties }[] = []
  const increment = 100 / props.divCount
  const curveFunc = CURVE_FUNCTIONS[props.curve] ?? CURVE_FUNCTIONS.linear

  for (let i = 1; i <= props.divCount; i++) {
    let progress = i / props.divCount
    progress = curveFunc(progress)

    let blurValue: number
    if (props.exponential) {
      blurValue = Math.pow(2, progress * 4) * 0.0625 * props.strength
    } else {
      blurValue = 0.0625 * (progress * props.divCount + 1) * props.strength
    }

    const p1 = Math.round((increment * i - increment) * 10) / 10
    const p2 = Math.round(increment * i * 10) / 10
    const p3 = Math.round((increment * i + increment) * 10) / 10
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10

    let gradient = `transparent ${p1}%, black ${p2}%`
    if (p3 <= 100) gradient += `, black ${p3}%`
    if (p4 <= 100) gradient += `, transparent ${p4}%`

    const direction = getGradientDirection(props.position)

    const divStyle: CSSProperties = {
      position: 'absolute',
      inset: '0',
      maskImage: `linear-gradient(${direction}, ${gradient})`,
      WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
      backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      opacity: props.opacity,
      filter: props.distortion ? 'url(#water-distortion)' : undefined
    }

    divs.push({ key: i, style: divStyle })
  }

  return divs
})

const containerStyle = computed(() => {
  const isVertical = ['top', 'bottom'].includes(props.position)
  const isHorizontal = ['left', 'right'].includes(props.position)
  const isPageTarget = props.target === 'page'

  const baseStyle: CSSProperties = {
    position: isPageTarget ? 'fixed' : 'absolute',
    pointerEvents: 'none',
    zIndex: isPageTarget ? props.zIndex + 100 : props.zIndex
  }

  if (isVertical) {
    baseStyle.height = props.height
    baseStyle.width = props.width || '100%'
    baseStyle[props.position] = '0'
    baseStyle.left = '0'
    baseStyle.right = '0'
  } else if (isHorizontal) {
    baseStyle.width = props.width || props.height
    baseStyle.height = '100%'
    baseStyle[props.position] = '0'
    baseStyle.top = '0'
    baseStyle.bottom = '0'
  }

  return baseStyle
})
</script>

<template>
  <div 
    class="gradual-blur" 
    :class="{ 'gradual-blur-page': target === 'page' }"
    :style="containerStyle"
  >
    <div class="gradual-blur-inner">
      <div 
        v-for="div in blurDivs" 
        :key="div.key" 
        :style="div.style"
      />
    </div>
    
    <!-- SVG filter for water distortion effect -->
    <svg v-if="distortion" style="position: absolute; width: 0; height: 0;">
      <defs>
        <filter id="water-distortion" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.02 0.05" 
            numOctaves="3" 
            result="noise"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="8" 
            xChannelSelector="R" 
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
@import './GradualBlur.css';
</style>

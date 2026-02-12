<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

interface Props {
  topColor?: string
  bottomColor?: string
  intensity?: number
  rotationSpeed?: number
  interactive?: boolean
  glowAmount?: number
  pillarWidth?: number
  pillarHeight?: number
  noiseIntensity?: number
  mixBlendMode?: string
  pillarRotation?: number
  quality?: 'low' | 'medium' | 'high'
}

const props = withDefaults(defineProps<Props>(), {
  topColor: '#5227FF',
  bottomColor: '#FF9FFC',
  intensity: 1.0,
  rotationSpeed: 0.3,
  interactive: false,
  glowAmount: 0.002,
  pillarWidth: 3.0,
  pillarHeight: 0.4,
  noiseIntensity: 0.5,
  mixBlendMode: 'screen',
  pillarRotation: 25,
  quality: 'high'
})

const containerRef = ref<HTMLDivElement | null>(null)
const webGLSupported = ref(true)

let rafId: number | null = null
let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | null = null
let geometry: THREE.PlaneGeometry | null = null
const mouse = new THREE.Vector2(0, 0)
let timeValue = 0

// Check WebGL support
const checkWebGL = () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (!gl) {
    webGLSupported.value = false
  }
}

const parseColor = (hex: string): THREE.Vector3 => {
  const color = new THREE.Color(hex)
  return new THREE.Vector3(color.r, color.g, color.b)
}

const initScene = () => {
  if (!containerRef.value || !webGLSupported.value) return

  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isLowEndDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)

  let effectiveQuality = props.quality
  if (isLowEndDevice && props.quality === 'high') effectiveQuality = 'medium'
  if (isMobile && props.quality !== 'low') effectiveQuality = 'low'

  const qualitySettings = {
    low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
    medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
    high: {
      iterations: 80,
      waveIterations: 4,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      precision: 'highp',
      stepMultiplier: 1.0
    }
  }

  const settings = qualitySettings[effectiveQuality] || qualitySettings.medium

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: effectiveQuality === 'high' ? 'high-performance' : 'low-power',
      precision: settings.precision as 'highp' | 'mediump' | 'lowp',
      stencil: false,
      depth: false
    })
  } catch {
    webGLSupported.value = false
    return
  }

  renderer.setSize(width, height)
  renderer.setPixelRatio(settings.pixelRatio)
  container.appendChild(renderer.domElement)

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    precision ${settings.precision} float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uTopColor;
    uniform vec3 uBottomColor;
    uniform float uIntensity;
    uniform bool uInteractive;
    uniform float uGlowAmount;
    uniform float uPillarWidth;
    uniform float uPillarHeight;
    uniform float uNoiseIntensity;
    uniform float uRotCos;
    uniform float uRotSin;
    uniform float uPillarRotCos;
    uniform float uPillarRotSin;
    uniform float uWaveSin;
    uniform float uWaveCos;
    varying vec2 vUv;

    const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
    const int MAX_ITER = ${settings.iterations};
    const int WAVE_ITER = ${settings.waveIterations};

    void main() {
      vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
      uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

      vec3 ro = vec3(0.0, 0.0, -10.0);
      vec3 rd = normalize(vec3(uv, 1.0));

      float rotC = uRotCos;
      float rotS = uRotSin;
      if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
        float a = uMouse.x * 6.283185;
        rotC = cos(a);
        rotS = sin(a);
      }

      vec3 col = vec3(0.0);
      float t = 0.1;
      
      for(int i = 0; i < MAX_ITER; i++) {
        vec3 p = ro + rd * t;
        p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

        vec3 q = p;
        q.y = p.y * uPillarHeight + uTime;
        
        float freq = 1.0;
        float amp = 1.0;
        for(int j = 0; j < WAVE_ITER; j++) {
          q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
          q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
          freq *= 2.0;
          amp *= 0.5;
        }
        
        float d = length(cos(q.xz)) - 0.2;
        float bound = length(p.xz) - uPillarWidth;
        float k = 4.0;
        float h = max(k - abs(d - bound), 0.0);
        d = max(d, bound) + h * h * 0.0625 / k;
        d = abs(d) * 0.15 + 0.01;

        float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
        col += mix(uBottomColor, uTopColor, grad) / d;

        t += d * STEP_MULT;
        if(t > 50.0) break;
      }

      float widthNorm = uPillarWidth / 3.0;
      col = tanh(col * uGlowAmount / widthNorm);
      
      col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
      
      gl_FragColor = vec4(col * uIntensity, 1.0);
    }
  `

  const pillarRotRad = (props.pillarRotation * Math.PI) / 180
  const waveSin = Math.sin(0.4)
  const waveCos = Math.cos(0.4)

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: mouse },
      uTopColor: { value: parseColor(props.topColor) },
      uBottomColor: { value: parseColor(props.bottomColor) },
      uIntensity: { value: props.intensity },
      uInteractive: { value: props.interactive },
      uGlowAmount: { value: props.glowAmount },
      uPillarWidth: { value: props.pillarWidth },
      uPillarHeight: { value: props.pillarHeight },
      uNoiseIntensity: { value: props.noiseIntensity },
      uRotCos: { value: 1.0 },
      uRotSin: { value: 0.0 },
      uPillarRotCos: { value: Math.cos(pillarRotRad) },
      uPillarRotSin: { value: Math.sin(pillarRotRad) },
      uWaveSin: { value: waveSin },
      uWaveCos: { value: waveCos }
    },
    transparent: true,
    depthWrite: false,
    depthTest: false
  })

  geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Mouse interaction
  let mouseMoveTimeout: number | null = null
  const handleMouseMove = (event: MouseEvent) => {
    if (!props.interactive) return
    if (mouseMoveTimeout) return

    mouseMoveTimeout = window.setTimeout(() => {
      mouseMoveTimeout = null
    }, 16)

    const rect = container.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    mouse.set(x, y)
  }

  if (props.interactive) {
    container.addEventListener('mousemove', handleMouseMove, { passive: true })
  }

  // Animation loop
  let lastTime = performance.now()
  const targetFPS = effectiveQuality === 'low' ? 30 : 60
  const frameTime = 1000 / targetFPS

  const animate = (currentTime: number) => {
    const mat = material
    const ren = renderer
    const sc = scene
    const cam = camera
    if (!mat || !ren || !sc || !cam) return

    const deltaTime = currentTime - lastTime

    if (deltaTime >= frameTime) {
      timeValue += 0.016 * props.rotationSpeed
      mat.uniforms.uTime!.value = timeValue
      mat.uniforms.uRotCos!.value = Math.cos(timeValue * 0.3)
      mat.uniforms.uRotSin!.value = Math.sin(timeValue * 0.3)
      ren.render(sc, cam)
      lastTime = currentTime - (deltaTime % frameTime)
    }

    rafId = requestAnimationFrame(animate)
  }
  rafId = requestAnimationFrame(animate)

  // Resize handling
  let resizeTimeout: number | null = null
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)

    resizeTimeout = window.setTimeout(() => {
      const ren = renderer
      const mat = material
      if (!ren || !mat || !containerRef.value) return
      const newWidth = containerRef.value.clientWidth
      const newHeight = containerRef.value.clientHeight
      ren.setSize(newWidth, newHeight)
      mat.uniforms.uResolution!.value.set(newWidth, newHeight)
    }, 150)
  }

  window.addEventListener('resize', handleResize, { passive: true })

  // Store cleanup references
  ;(container as any).__lightPillarCleanup = () => {
    window.removeEventListener('resize', handleResize)
    if (props.interactive) {
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }
}

const cleanup = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    if (containerRef.value && containerRef.value.contains(renderer.domElement)) {
      containerRef.value.removeChild(renderer.domElement)
    }
    renderer = null
  }
  if (material) {
    material.dispose()
    material = null
  }
  if (geometry) {
    geometry.dispose()
    geometry = null
  }
  if (containerRef.value && (containerRef.value as any).__lightPillarCleanup) {
    ;(containerRef.value as any).__lightPillarCleanup()
  }
  scene = null
  camera = null
}

onMounted(() => {
  checkWebGL()
  initScene()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <div v-if="!webGLSupported" class="light-pillar-fallback" :style="{ mixBlendMode: mixBlendMode as any }">
    WebGL not supported
  </div>
  <div v-else ref="containerRef" class="light-pillar-container" :style="{ mixBlendMode: mixBlendMode as any }" />
</template>

<style scoped>
.light-pillar-fallback {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  color: #888;
  font-size: 14px;
}

.light-pillar-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useTheme } from './utils/useTheme'
import { useUIState } from './utils/useUIState'

const containerRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const loadProgress = ref(0)
const errorMsg = ref('')

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let mixer: THREE.AnimationMixer | null = null
let clock: THREE.Clock
let animationFrameId: number
let model: THREE.Object3D | null = null

// Light references for theme synchronization
let ambientLight: THREE.AmbientLight
let fillLight: THREE.DirectionalLight
let rimLight: THREE.DirectionalLight
let pointLight: THREE.PointLight

const { themeColors } = useTheme()
const { isAboutOpen } = useUIState()

watch(isAboutOpen, (open) => {
  if (open) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  } else {
    animate()
  }
})

function init() {
  if (!containerRef.value) return

  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
  camera.position.set(0, 100, 100)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.85
  container.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.enableZoom = false
  controls.minDistance = 50
  controls.maxDistance = 800
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  controls.target.set(0, 50, 0)

  // Lights — synced with theme
  ambientLight = new THREE.AmbientLight(themeColors.value.top, 0.3)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0x8888aa, 0.85)
  dirLight.position.set(200, 300, 200)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 1500
  dirLight.shadow.camera.left = -500
  dirLight.shadow.camera.right = 500
  dirLight.shadow.camera.top = 500
  dirLight.shadow.camera.bottom = -500
  scene.add(dirLight)

  fillLight = new THREE.DirectionalLight(themeColors.value.top, 0.3)
  fillLight.position.set(-200, 100, -200)
  scene.add(fillLight)

  rimLight = new THREE.DirectionalLight(themeColors.value.bottom, 0.6)
  rimLight.position.set(0, -100, -300)
  scene.add(rimLight)

  pointLight = new THREE.PointLight(themeColors.value.top, 0.2, 500)
  pointLight.position.set(0, 80, 120)
  scene.add(pointLight)

  // Clock
  clock = new THREE.Clock()

  // Load FBX model
  loadModel()

  // Handle resize
  window.addEventListener('resize', onResize)

  // Handle scroll for rotation
  window.addEventListener('scroll', onScroll)
}

function loadModel() {
  const loader = new FBXLoader()

  loader.load(
    '/alien-fish-animated/source/alien-fish-animated.fbx',
    (object) => {
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      })

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(object)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 520 / maxDim
      object.scale.setScalar(scale)
      object.position.sub(center.multiplyScalar(scale))
      object.position.y += 60
      object.position.x -= 50

      model = object
      object.rotation.y = Math.PI / 4
      scene.add(object)

      // Setup animations if available
      if (object.animations && object.animations.length > 0) {
        mixer = new THREE.AnimationMixer(object)
        object.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip)
          action.setLoop(THREE.LoopPingPong, Infinity)
          action.clampWhenFinished = false
          action.fadeIn(1.5)
          action.play()
        })
      }

      // Adjust camera to fit model
      camera.position.set(0, size.y * scale * 0.4, maxDim * scale * 0.8)
      controls.target.set(0, size.y * scale * 0.15, 0)
      controls.update()

      loading.value = false
    },
    (progress) => {
      if (progress.total > 0) {
        loadProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    },
    (error) => {
      console.error('Error loading FBX:', error)
      errorMsg.value = 'Error al cargar el modelo 3D'
      loading.value = false
    }
  )
}

// Handle scroll based rotation
function onScroll() {
  if (!scene) return
  const scrollY = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight
  const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0
  // Suave: solo media vuelta (180°) en toda la página
  const targetRotation = scrollPercent * Math.PI * 0.5
  // Lerp suave hacia el target
  scene.rotation.y += (targetRotation - scene.rotation.y) * 0.08
}

function onResize() {
  if (!containerRef.value) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)
  const delta = clock.getDelta()
  if (mixer) {
    mixer.update(delta)
  }

  controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
})

// Watch for theme changes and update lights + model color
watch(themeColors, (newColors) => {
  if (ambientLight) ambientLight.color.set(newColors.top)
  if (fillLight) fillLight.color.set(newColors.top)
  if (pointLight) pointLight.color.set(newColors.top)
  if (rimLight) rimLight.color.set(newColors.bottom)

}, { deep: true })

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', onResize)
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
})
</script>

<template>
  <div class="dragon-skull-bg">
    <div ref="containerRef" class="dragon-skull-canvas"></div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Cargando Alien Fish...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadProgress + '%' }"></div>
        </div>
        <span class="progress-text">{{ loadProgress }}%</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMsg" class="error-overlay">
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>

<style scoped>
.dragon-skull-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
}

.dragon-skull-canvas {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border: 3px solid rgba(100, 108, 255, 0.2);
  border-top-color: #646cff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 0 auto 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #646cff, #a855f7);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 0, 40, 0.95);
  color: #ff4444;
  font-size: 1.2rem;
  z-index: 10;
}
</style>

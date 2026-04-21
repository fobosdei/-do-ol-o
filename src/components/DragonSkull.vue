<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useCursorTracking } from './utils/useCursorTracking'
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

const { x: cursorX, y: cursorY, width: windowWidth, height: windowHeight } = useCursorTracking()

function init() {
  if (!containerRef.value) return

  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
  camera.position.set(0, 100, 300)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.enableZoom = false // Disabled zoom on scroll
  controls.minDistance = 50
  controls.maxDistance = 800
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5 // Slower auto-rotate
  controls.target.set(0, 50, 0)

  // Lights — synced with theme
  ambientLight = new THREE.AmbientLight(themeColors.value.top, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xccccff, 1.5)
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

  fillLight = new THREE.DirectionalLight(themeColors.value.top, 0.7)
  fillLight.position.set(-200, 100, -200)
  scene.add(fillLight)

  rimLight = new THREE.DirectionalLight(themeColors.value.bottom, 0.5)
  rimLight.position.set(0, -100, -300)
  scene.add(rimLight)

  pointLight = new THREE.PointLight(themeColors.value.top, 0.8, 500)
  pointLight.position.set(0, 80, 100)
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

const { isAboutOpen } = useUIState()

watch(isAboutOpen, (open) => {
  if (open) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  } else {
    animate()
  }
})

function loadModel() {
  const loader = new FBXLoader()
// ... (rest of the file remains the same, I will use a smaller chunk to be safe)

  // Load textures
  const textureLoader = new THREE.TextureLoader()
  const basePath = '/dragon-skull-2/textures/'

  const diffuseMap = textureLoader.load(basePath + 'texture_pbr_20250901.png')
  const normalMap = textureLoader.load(basePath + 'texture_pbr_20250901_normal.png')
  const roughnessMap = textureLoader.load(basePath + 'texture_pbr_20250901_roughness.png')
  const metalnessMap = textureLoader.load(basePath + 'texture_pbr_20250901_metallic.png')

  // Set texture properties
  ;[diffuseMap, normalMap, roughnessMap, metalnessMap].forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
  })
  // Normal map should be linear
  normalMap.colorSpace = THREE.LinearSRGBColorSpace
  roughnessMap.colorSpace = THREE.LinearSRGBColorSpace
  metalnessMap.colorSpace = THREE.LinearSRGBColorSpace

  loader.load(
    '/dragon-skull-2/source/dragon-skull-2.fbx',
    (object) => {
      // Apply PBR materials
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true

          const pbrMaterial = new THREE.MeshStandardMaterial({
            map: diffuseMap,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
            metalnessMap: metalnessMap,
            roughness: 0.7,
            metalness: 0.3,
          })
          mesh.material = pbrMaterial
        }
      })

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(object)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 150 / maxDim
      object.scale.setScalar(scale)
      object.position.sub(center.multiplyScalar(scale))
      object.position.y += 60
      
      model = object
      scene.add(object)

      // Setup animations if available
      if (object.animations && object.animations.length > 0) {
        mixer = new THREE.AnimationMixer(object)
        object.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip)
          action.play()
        })
      }

      // Adjust camera to fit model
      // ZOOM: cambia el último número para ajustar el zoom inicial (más bajo = más cerca)
      camera.position.set(0, size.y * scale * 0.5, maxDim * scale * 1.7)
      controls.target.set(0, size.y * scale * 0.3, 0)
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

  // Calculate rotation based on scroll percentage
  const scrollY = window.scrollY
  const maxScroll = document.body.scrollHeight - window.innerHeight
  // Guard against divide by zero if page is not scrollable
  const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0

  // Rotate the entire scene or specific object group
  // Completes 2 full rotations over the page length
  const targetRotation = scrollPercent * Math.PI * 4 

  scene.rotation.y = targetRotation
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

  if (model) {
    const ndcX = (cursorX.value / windowWidth.value) * 2 - 1
    const ndcY = -(cursorY.value / windowHeight.value) * 2 + 1

    // Target rotation based on cursor position
    const targetX = -ndcY * 0.5 
    const targetY = ndcX * 0.5 

    // Smoothly interpolate current rotation to target
    // Note: We're adding to the base rotation if needed, but since model.rotation is local
    // and distinct from scene/controls, this works as a "look at" offset.
    const ease = 0.1
    model.rotation.x += (targetX - model.rotation.x) * ease
    model.rotation.y += (targetY - model.rotation.y) * ease
  }

  controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
})

// Watch for theme changes and update lights
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
        <p class="loading-text">Cargando Dragon Skull...</p>
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

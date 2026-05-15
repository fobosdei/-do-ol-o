<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { useUIState } from './utils/useUIState'
import { useTheme } from './utils/useTheme'
import InfiniteMenu from './effects/InfiniteMenu.vue'
import Lightning from './effects/Lightning.vue'

const { isProjectsOpen, closeProjects } = useUIState()
const { theme } = useTheme()

const lightningHue = computed(() => theme.value === 'violet' ? 142 : 217)

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isProjectsOpen.value) closeProjects()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))

const projects = [
  {
    image: '/cj.ico',
    title: 'Siboney POS',
    description: 'Kafkha POS — Sistema de Punto de Venta para Grill & Discoteca\nDesarrollador independiente — Proyecto completo\nSistema de punto de venta de escritorio desarrollado a medida para un negocio de entretenimiento nocturno, construido con Electron y distribuido como instalador nativo para Windows.\nArquitectura con backend embebido en Express, base de datos SQLite local para operación offline y sincronización cloud para respaldo de datos — todo empaquetado en una sola aplicación sin dependencias externas para el negocio.\nCubre el ciclo operativo completo: gestión de mesas y órdenes en tiempo real, checkout con facturación, apertura/cierre de caja por turno, control de ingresos/egresos, inventario con validación de stock e impresión térmica automática para comandas y comprobantes. Sistema de roles admin/cajero con autenticación para operaciones sensibles.\nStack: Electron · Express · SQLite · Node.js · HTML/CSS/JS · node-thermal-printer',
    link: 'app-electron'
  },
  {
    image: '/suarec.png',
    title: 'SUAREC',
    description: 'SUAREC — Marketplace de servicios y empleos\nCTO & Lead Developer\nMe incorporé cuando la plataforma tenía un 50% de avance, asumiendo ownership técnico completo con enfoque en escalabilidad y estabilidad. Lideré el desarrollo de wallet virtual, sistema de contratos, automatizaciones multi-tenant con n8n, bot de reservas con IA e integración de la API de Anthropic. Gestioné el ciclo completo de publicación móvil en App Store y Google Play con base de usuarios activa en producción.\nPlataforma robusta con arquitectura multi-repo, autenticación segura con JWT, cifrado de datos sensibles, y Row Level Security en Supabase. Sistema diseñado para escalar con múltiples tenants y flujos financieros reales en producción.\nStack: Vue 3 · Node.js · React Native/Expo · Supabase · PostgreSQL · n8n · Anthropic API',
    link: 'suarec'
  },
  {
    image: '/lockpass.png',
    title: 'Lock Pass',
    description: 'Vault — Gestor de contraseñas con arquitectura zero-knowledge. Cada credencial se cifra con AES-256-GCM usando IV unico y derivacion de clave via PBKDF2, garantizando que el servidor nunca acceda a datos en texto plano. Backend en Node.js y Express con autenticacion JWT, base de datos PostgreSQL en Supabase con Row Level Security por usuario, y auto-lock por inactividad. Cliente en Electron + React con fondos animados en Three.js, empaquetado para Windows, macOS y Linux. Implementacion de criptografia avanzada, arquitectura cliente-servidor segura y desarrollo de aplicaciones de escritorio profesionales.',
    link: 'lock-pass'
  },
  {
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=900&h=900&fit=crop',
    title: 'Portfolio',
    description: 'Este mismo sitio — Vue 3 + TypeScript + Vite. Diseño inmersivo con WebGL, Liquid Glass UI y paleta verde.',
    link: 'portfolio'
  }
]

const handleItemClick = (_item: { title?: string; link?: string }) => {
  closeProjects()
}
</script>

<template>
  <Transition name="projects-overlay">
    <div v-if="isProjectsOpen" class="projects-overlay">
      <div class="projects-lightning-wrapper">
        <Lightning
          :hue="lightningHue"
          :intensity="0.9"
          :speed="0.6"
          :size="1.2"
        />
      </div>
      <!-- dim disabled for debug -->

      <button class="close-btn" @click="closeProjects">×</button>

      <div class="projects-header">
        <h2 class="projects-title">Proyectos</h2>
        <p class="projects-subtitle">Arrastrá el globo para explorar</p>
      </div>

      <div class="projects-globe">
        <InfiniteMenu
          :items="projects"
          :scale="3"
          @item-click="handleItemClick"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.projects-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.projects-lightning-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.projects-overlay-dim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(2, 5, 3, 0.72);
}

.close-btn {
  position: absolute;
  top: 1.4rem;
  right: 1.6rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.6rem;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
  line-height: 1;
  transition: background 0.2s ease, color 0.2s ease;
  z-index: 10;
}

.projects-header {
  z-index: 5;
}

.projects-globe {
  z-index: 2;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.projects-header {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  z-index: 5;
}

.projects-title {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #fff, var(--accent-light, #86efac));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.projects-subtitle {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0.3rem 0 0;
  font-weight: 300;
  letter-spacing: 0.04em;
}

.projects-globe {
  width: 100%;
  height: 100%;
}

/* Transición de entrada/salida */
.projects-overlay-enter-active,
.projects-overlay-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.projects-overlay-enter-from,
.projects-overlay-leave-to {
  opacity: 0;
  transform: scale(1.04);
}
</style>

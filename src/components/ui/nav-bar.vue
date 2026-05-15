<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

import LiquidGlass from '../interfaces/liquidglass.vue'
import { useUIState } from '../utils/useUIState'

const { toggleAbout, toggleProjects, toggleContact, closeAll, isAboutOpen, isProjectsOpen, isContactOpen } = useUIState()

const navItems = [
  { label: 'Inicio', href: '#' },
  { label: 'Sobre mí', href: '#about' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Notas', href: '#notes' },
  { label: 'Contacto', href: '#contact' }
]

const activeIndex = ref(0)

watch([isAboutOpen, isProjectsOpen, isContactOpen], ([about, projects, contact]) => {
  if (!about && !projects && !contact) activeIndex.value = 0
  else if (about) activeIndex.value = 1
  else if (projects) activeIndex.value = 2
  else if (contact) activeIndex.value = 4
})
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="floating-nav" :class="{ scrolled: isScrolled }">
    <LiquidGlass
      :width="'auto'"
      :height="'auto'"
      :border-radius="50"
      :border-width="0.2"
      :opacity="0.15"
      :blur="6"
      :displace="0.5"
      :distortion-scale="10"
      mix-blend-mode="normal"
      class="nav-pill-glass"
    >
      <div class="nav-pill-content">
        <a
          v-for="(item, index) in navItems"
          :key="item.label"
          :href="item.href"
          class="nav-link"
          :class="{ active: activeIndex === index }"

          @click.prevent="() => {
            activeIndex = index
            if (item.label === 'Sobre mí') toggleAbout()
            else if (item.label === 'Proyectos') toggleProjects()
            else if (item.label === 'Contacto') toggleContact()
            else closeAll()
          }"
        >
          {{ item.label }}
          <span v-if="activeIndex === index" class="active-indicator">/</span>
        </a>
      </div>
    </LiquidGlass>
  </nav>
</template>

<style scoped>
.floating-nav {
  position: fixed;
  top: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  transition: top 0.3s ease;
}

.floating-nav.scrolled {
  top: 0.8rem;
}

.nav-pill-glass {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.nav-pill-content {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.4rem;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1.1rem;
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.25s ease;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.active-indicator {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 300;
}

/* Responsive */
@media (max-width: 640px) {
  .nav-pill-content {
    gap: 0.1rem;
    padding: 0.2rem 0.3rem;
  }

  .nav-link {
    padding: 0.4rem 0.7rem;
    font-size: 0.78rem;
  }
}
</style>

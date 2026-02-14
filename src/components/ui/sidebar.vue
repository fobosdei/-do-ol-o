<script setup lang="ts">
import { ref } from 'vue'
import LiquidGlass from '../interfaces/liquidglass.vue'
import { useUIState } from '../utils/useUIState'

const { isAboutOpen } = useUIState()

const sidebarItems = [
  { icon: 'github', label: 'GitHub', href: '#' },
  { icon: 'linkedin', label: 'LinkedIn', href: '#' },
  { icon: 'twitter', label: 'Twitter', href: '#' },
  { icon: 'mail', label: 'Email', href: '#' }
]

const activeIndex = ref(-1)
</script>

<template>
  <aside class="floating-sidebar" :class="{ 'sidebar-hidden': isAboutOpen }">
    <LiquidGlass
      :width="'100%'"
      :height="'auto'"
      :border-radius="50"
      :border-width="0.2"
      :opacity="0.15"
      :blur="6"
      :displace="0.5"
      :distortion-scale="10"
      mix-blend-mode="normal"
      class="sidebar-glass"
    >
      <div class="sidebar-content">
        <a
          v-for="(item, index) in sidebarItems"
          :key="item.label"
          :href="item.href"
          class="sidebar-link"
          @mouseenter="activeIndex = index"
          @mouseleave="activeIndex = -1"
          :title="item.label"
        >
          <!-- Simple SVG Icons placeholders -->
          <svg v-if="item.icon === 'github'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <svg v-else-if="item.icon === 'linkedin'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          <svg v-else-if="item.icon === 'twitter'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
      </div>
    </LiquidGlass>
  </aside>
</template>

<style scoped>
.floating-sidebar {
  position: fixed;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  z-index: 90;
  opacity: 1;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.floating-sidebar.sidebar-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(100%);
}

.sidebar-glass {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0.6rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
}

.sidebar-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}
</style>

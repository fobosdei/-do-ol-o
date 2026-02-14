<script setup lang="ts">
import DragonSkull from './components/DragonSkull.vue'
import LightPillarBackground from './components/LightPillarBackground.vue'
import NavBar from './components/ui/nav-bar.vue'
import ThemeToggle from './components/ui/ThemeToggle.vue'
import Sidebar from './components/ui/sidebar.vue'
import AboutmeCard from './components/AboutmeCard.vue'
import HelloWorld from './components/HelloWorld.vue'
import PageLayout from './layouts/PageLayout.vue'
import { useTheme } from './components/utils/useTheme'
import { useSmoothScroll } from './core/useSmoothScroll'

const { theme, themeColors, setTheme } = useTheme()
useSmoothScroll()

const toggleTheme = () => {
  setTheme(theme.value === 'violet' ? 'navy' : 'violet')
}
</script>

<template>
  <PageLayout>
    <!-- Floating Navbar -->
    <NavBar />

    <!-- Light Pillar Animated Background -->
    <div class="light-pillar-bg">
      <LightPillarBackground
        :topColor="themeColors.top"
        :bottomColor="themeColors.bottom"
        :intensity="1"
        :rotationSpeed="0.3"
        :glowAmount="0.002"
        :pillarWidth="3"
        :pillarHeight="0.4"
        :noiseIntensity="0.5"
        :pillarRotation="25"
        :interactive="false"
        mixBlendMode="screen"
        quality="high"
      />
    </div>

    <ThemeToggle :theme="theme" @toggle="toggleTheme" />
    <Sidebar />
    <AboutmeCard />

    <!-- 3D Background -->
    <DragonSkull />

    <!-- Landing page content overlay -->
    <HelloWorld />
  </PageLayout>
</template>

<style scoped>
.light-pillar-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>

<script setup lang="ts">
import DragonSkull from './components/DragonSkull.vue'
import LightPillarBackground from './components/LightPillarBackground.vue'
import NavBar from './components/ui/nav-bar.vue'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- Floating Navbar -->
  <NavBar />

  <!-- Light Pillar Animated Background -->
  <div class="light-pillar-bg">
    <LightPillarBackground
      topColor="#5227FF"
      bottomColor="#FF9FFC"
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

  <!-- 3D Background -->
  <DragonSkull />

  <!-- Landing page content overlay -->
  <HelloWorld />
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

<script setup lang="ts">
import GradualBlur from '../components/effects/GradualBlur.vue'
</script>

<template>
  <div class="page-layout">
    <!-- Content -->
    <slot />
    
    <!-- Blur border only on bottom with distortion -->
    <GradualBlur 
      position="bottom" 
      :strength="3" 
      height="4rem" 
      target="page"
      :z-index="9999"
      curve="ease-out"
      :distortion="true"
    />
  </div>
</template>

<style scoped>
.page-layout {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>

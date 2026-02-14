<script setup lang="ts">
import { useUIState } from './utils/useUIState'
import LiquidGlass from './interfaces/liquidglass.vue'
import AboutMeChild from './ui/aboutmechild.vue'

const { isAboutOpen, closeAbout } = useUIState()
</script>

<template>
    <div class="aboutme-container" :class="{ 'is-open': isAboutOpen }">
      <LiquidGlass
        :width="'100%'"
        :height="'auto'"
        :border-radius="30"
        :border-width="0.2"
        :opacity="0.2"
        :blur="12"
        :displace="0.4"
        :distortion-scale="20"
        mix-blend-mode="normal"
        class="aboutme-glass"
      >
        <div class="aboutme-content">
          <button class="close-btn" @click="closeAbout">×</button>
          
          <div class="profile-image-placeholder">
            <div class="image-inner">
              <!-- Placeholder for user photo -->
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>

          <h2>Sobre Mí</h2>
          <p>
            Soy un desarrollador apasionado por crear experiencias web inmersivas y dinámicas. 
            Me encanta combinar diseño moderno con tecnología de vanguardia.
          </p>
          <div class="skills">
            <span>Vue.js</span>
            <span>Three.js</span>
            <span>TypeScript</span>
            <span>Design</span>
          </div>
        </div>
      </LiquidGlass>
    </div>
    
    <AboutMeChild :show="isAboutOpen" />
</template>

<style scoped>
.aboutme-container {
  position: fixed;
  top: 50%;
  left: 3rem;
  transform: translateY(-50%) translateX(-120%);
  width: 350px;
  max-width: calc(100vw - 6rem); /* Margin on both sides */
  height: auto;
  z-index: 200;
  opacity: 0;
  will-change: transform, opacity;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.aboutme-container.is-open {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
}

.aboutme-glass {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.aboutme-content {
  padding: 2rem;
  color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.profile-image-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.image-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(160, 160, 255, 0.1), transparent 70%);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

h2 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #fff, #a0a0ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.skills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.skills span {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}


</style>

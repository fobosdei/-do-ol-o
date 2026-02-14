<script setup lang="ts">
import LiquidGlass from '../interfaces/liquidglass.vue'

defineProps<{
  show: boolean
}>()
</script>

<template>
  <div class="aboutme-child-container" :class="{ 'is-visible': show }">
    <LiquidGlass
      :width="'100%'"
      :height="'100%'"
      :border-radius="20"
      :border-width="0.2"
      :opacity="0.1"
      :blur="8"
      :displace="0.3"
      :distortion-scale="15"
      mix-blend-mode="normal"
      class="child-glass"
    >
      <div class="child-content">
        <h3>Experiencia & Habilidades</h3>
        <p>
          Aquí irán los detalles más profundos sobre mi trayectoria, proyectos destacados 
          y las tecnologías que domino. Este componente aparece en el centro para dar 
          protagonismo a la información detallada.
        </p>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">3+</span>
            <span class="stat-label">Años de Exp.</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">20+</span>
            <span class="stat-label">Proyectos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100%</span>
            <span class="stat-label">Pasión</span>
          </div>
        </div>
      </div>
    </LiquidGlass>
  </div>
</template>

<style scoped>
.aboutme-child-container {
  position: fixed;
  top: 50%;
  left: calc(50% + 180px); /* Shifted right to avoid parent overlap */
  transform: translate(-50%, -50%) scale(0.9);
  width: 800px;
  max-width: calc(100vw - 1rem); /* Margin on both sides */
  height: 450px;
  max-height: calc(100vh - 2rem); /* Margin top and bottom */
  z-index: 190;
  opacity: 0;
  pointer-events: none;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.aboutme-child-container.is-visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
}

.child-glass {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.child-content {
  padding: 2.5rem;
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #a0a0ff;
}

p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>

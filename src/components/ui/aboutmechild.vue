<script setup lang="ts">


defineProps<{
  show: boolean
}>()
</script>

<template>
  <div class="aboutme-child-container" :class="{ 'is-visible': show }">
    <div class="glass-card child-glass">
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
    </div>
  </div>
</template>

<style scoped>
.aboutme-child-container {
  position: fixed;
  top: 50%;
  left: calc(50% + 180px); /* Shifted right to avoid parent overlap */
  transform: translate(-50%, -50%); /* Removed scale(0.9) to fix size */
  width: 800px;
  max-width: calc(100vw - 1rem); /* Margin on both sides */
  height: 450px;
  max-height: calc(100vh - 2rem); /* Margin top and bottom */
  z-index: 190;
  z-index: 190;
  /* Remove opacity: 0 here to let the child manage visibility via height, or keep it but make it fast */
  opacity: 1; 
  visibility: hidden; /* Use visibility to hide interactions when closed */
  pointer-events: none;
  transition: visibility 0s linear 1s; /* Delay hiding so height animation can finish */
}

.aboutme-child-container.is-visible {
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0s; /* Appear immediately */
  transform: translate(-50%, -50%); /* Ensure centering is maintained */
}

.child-glass {
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: 100%;
  /* Animation: Fill from bottom */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0%; /* Start empty */
  overflow: hidden;
  transition: height 1s cubic-bezier(0.25, 1, 0.5, 1);
}

.aboutme-child-container.is-visible .child-glass {
  height: 100%;
}

.child-content {
  padding: 1.0rem;
  color: #fff;
  /* Content pinned to bottom with full height to maintain layout during reveal */
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Restore full height */
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

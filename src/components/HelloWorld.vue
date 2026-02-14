<script setup lang="ts">
import { useUIState } from './utils/useUIState'

defineProps<{ msg?: string }>()

const { isAboutOpen } = useUIState()
</script>

<template>
  <div class="landing" :class="{ 'is-hidden': isAboutOpen }">
    <section class="hero">
      <h1 class="hero-title">kafkha</h1>
      <p class="hero-subtitle">entusiasta y progresista</p>
      <div class="hero-actions">
        <button class="btn-primary">Explorar</button>
        <button class="btn-secondary">Saber más</button>
      </div>
    </section>

    <section class="info-section">
      <div class="info-grid">
        <div class="info-card">
          <h3>Modelo 3D</h3>
          <p>Renderizado en tiempo real con Three.js y texturas PBR de alta calidad.</p>
        </div>
        <div class="info-card">
          <h3>Interactivo</h3>
          <p>Arrastra para rotar, usa scroll para acercar o alejar el modelo.</p>
        </div>
        <div class="info-card">
          <h3>Detalle</h3>
          <p>Texturas de difusión, normales, rugosidad y metalicidad aplicadas.</p>
        </div>
      </div>
    </section>

    <section class="feature-section">
      <h2>Características</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <h4>Velocidad</h4>
          <p>Optimizado para un rendimiento máximo en todos los dispositivos.</p>
        </div>
        <div class="feature-item">
          <h4>Diseño</h4>
          <p>Interfaz moderna y minimalista con atención al detalle.</p>
        </div>
        <div class="feature-item">
          <h4>Tecnología</h4>
          <p>Construido con las últimas tecnologías web: Vue 3 y Vite.</p>
        </div>
        <div class="feature-item">
          <h4>Responsive</h4>
          <p>Se adapta perfectamente a cualquier tamaño de pantalla.</p>
        </div>
      </div>
    </section>

    <section class="tech-section">
      <h2>Stack Tecnológico</h2>
      <div class="tech-logos">
        <span>Vue.js</span>
        <span>Three.js</span>
        <span>TypeScript</span>
        <span>Vite</span>
      </div>
    </section>
    
    <section class="contact-section" id="contact">
      <h2>Contacto</h2>
      <p>¿Tienes un proyecto en mente? Hablemos.</p>
      <button class="btn-primary">Contactar ahora</button>
    </section>

    <footer>
      <p>&copy; 2024 Kafkha. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  position: relative;
  z-index: 1;
  pointer-events: none;
  transition: opacity 0.8s ease, transform 0.8s ease;
  opacity: 1;
  transform: scale(1);
}

.landing.is-hidden {
  opacity: 0;
  transform: scale(0.95);
}

.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  margin: 0 auto;
  max-width: 100%;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ffffff, #a0a0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.55);
  margin: 1rem 0 2.5rem;
  font-weight: 300;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  pointer-events: auto;
}

.btn-primary {
  padding: 0.8rem 2.4rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #646cff, #42b883);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(100, 108, 255, 0.4);
}

.btn-secondary {
  padding: 0.8rem 2.4rem;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
}

.info-section {
  padding: 4rem 2rem 6rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  pointer-events: auto;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  transition: transform 0.2s, background 0.2s;
}

.info-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.info-card h3 {
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
  color: #fff;
}

.info-card p {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
}

.feature-section,
.tech-section,
.contact-section {
  padding: 4rem 2rem;
  text-align: center;
}

.feature-section h2,
.tech-section h2,
.contact-section h2 {
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #fff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-item h4 {
  color: #a0a0ff;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feature-item p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.tech-logos {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.tech-logos span {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.contact-section {
  padding-bottom: 6rem;
}

.contact-section p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
}

footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
}
</style>

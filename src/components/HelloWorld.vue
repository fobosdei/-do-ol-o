<script setup lang="ts">
import { useUIState } from './utils/useUIState'
import LiquidGlass from './interfaces/liquidglass.vue'

defineProps<{ msg?: string }>()

const { isAboutOpen } = useUIState()
</script>

<template>
  <div class="landing" :class="{ 'is-hidden': isAboutOpen }">
    <section class="hero">
      <h1 class="hero-title">kafkha</h1>
      <p class="hero-subtitle">entusiasta y progresista</p>
      <div class="hero-actions">
        <div class="btn-wrap btn-wrap--primary">
          <LiquidGlass
            width="auto"
            height="auto"
            :border-radius="50"
            :border-width="0.2"
            :opacity="0.15"
            :blur="6"
            :displace="0.5"
            :distortion-scale="10"
            mix-blend-mode="normal"
            class="btn-glass"
          >
            <button class="btn-inner btn-inner--primary">Explorar</button>
          </LiquidGlass>
        </div>

        <div class="btn-wrap btn-wrap--secondary">
          <LiquidGlass
            width="auto"
            height="auto"
            :border-radius="50"
            :border-width="0.2"
            :opacity="0.15"
            :blur="6"
            :displace="0.5"
            :distortion-scale="10"
            mix-blend-mode="normal"
            class="btn-glass"
          >
            <button class="btn-inner btn-inner--secondary">Saber más</button>
          </LiquidGlass>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="info-grid">
        <div class="info-card">
          <div class="info-card-badge">01</div>
          <h3>Modelo 3D</h3>
          <p>Renderizado en tiempo real con Three.js y texturas PBR de alta calidad.</p>
        </div>
        <div class="info-card">
          <div class="info-card-badge">02</div>
          <h3>Interactivo</h3>
          <p>Arrastra para rotar, usa scroll para acercar o alejar el modelo.</p>
        </div>
        <div class="info-card">
          <div class="info-card-badge">03</div>
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
      <div class="btn-wrap btn-wrap--primary contact-btn">
        <LiquidGlass
          width="auto"
          height="auto"
          :border-radius="50"
          :border-width="0.2"
          :opacity="0.15"
          :blur="6"
          :displace="0.5"
          :distortion-scale="10"
          mix-blend-mode="normal"
          class="btn-glass"
        >
          <button class="btn-inner btn-inner--primary">Contactar ahora</button>
        </LiquidGlass>
      </div>
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
  background: linear-gradient(135deg, #ffffff, var(--accent-light));
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

.btn-wrap {
  position: relative;
  border-radius: 50px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.btn-wrap:hover {
  transform: translateY(-2px);
}


.btn-wrap--primary {
  box-shadow: 0 4px 24px rgba(var(--accent-glow-rgb), 0.2);
}

.btn-wrap--primary:hover {
  box-shadow: 0 10px 36px rgba(var(--accent-glow-rgb), 0.38);
}

.btn-wrap--secondary:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.btn-glass {
  cursor: pointer;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 2.2rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  white-space: nowrap;
  pointer-events: none;
}

.btn-inner--primary {
  color: var(--accent-light);
  text-shadow: 0 0 18px rgba(var(--accent-glow-rgb), 0.7);
}

.btn-inner--secondary {
  color: rgba(255, 255, 255, 0.78);
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
  position: relative;
  background: rgba(10, 20, 15, 0.55);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem 2rem 2rem 2.2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  counter-increment: card-counter;
}

.info-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(var(--accent-glow-rgb), 0.4), rgba(255,255,255,0.06) 60%, rgba(var(--accent-glow-rgb), 0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.info-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-light), transparent);
  border-radius: 20px 20px 0 0;
}

.info-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(var(--accent-glow-rgb), 0.15), 0 4px 20px rgba(0,0,0,0.4);
}

.info-card-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(var(--accent-glow-rgb), 0.25), rgba(var(--accent-glow-rgb), 0.08));
  border: 1px solid rgba(var(--accent-glow-rgb), 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-light);
  margin-bottom: 1.1rem;
}

.info-card h3 {
  margin: 0 0 0.6rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.info-card p {
  margin: 0;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.65;
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
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  pointer-events: auto;
}

.feature-item {
  position: relative;
  background: rgba(10, 20, 15, 0.45);
  backdrop-filter: blur(16px);
  padding: 1.8rem 1.6rem;
  border-radius: 16px;
  border: 1px solid rgba(74, 222, 128, 0.1);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-glow-rgb), 0.3), transparent);
}

.feature-item:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--accent-glow-rgb), 0.25);
  box-shadow: 0 12px 40px rgba(var(--accent-glow-rgb), 0.1), 0 2px 12px rgba(0,0,0,0.3);
}

.feature-item h4 {
  color: var(--accent-light);
  margin: 0 0 0.6rem;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-item h4::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  flex-shrink: 0;
}

.feature-item p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
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

.contact-btn {
  display: inline-flex;
  pointer-events: auto;
}

footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
}
</style>

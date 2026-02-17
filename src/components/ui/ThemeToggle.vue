<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Waves } from 'lucide-vue-next'

const props = defineProps<{
  theme: 'violet' | 'navy'
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const isViolet = computed(() => props.theme === 'violet')
</script>

<template>
  <div
    class="theme-wrapper"
    :class="isViolet ? 'wrapper--violet' : 'wrapper--navy'"
    @click="emit('toggle')"
  >
    <!-- Track (el fondo del toggle) -->
    <div class="track">

      <!-- Labels de ambos lados -->
      <span class="track-label label--violet" :class="{ active: isViolet }">
        <Sparkles :size="13" :stroke-width="2" />
        Violeta
      </span>

      <span class="track-label label--navy" :class="{ active: !isViolet }">
        <Waves :size="13" :stroke-width="2" />
        Océano
      </span>

      <!-- Thumb (el círculo que se mueve) -->
      <div class="thumb" :class="isViolet ? 'thumb--violet' : 'thumb--navy'">
        <Transition name="icon-swap" mode="out-in">
          <Sparkles
            v-if="isViolet"
            key="sparkles"
            :size="16"
            :stroke-width="1.8"
            class="thumb-icon"
          />
          <Waves
            v-else
            key="waves"
            :size="16"
            :stroke-width="1.8"
            class="thumb-icon"
          />
        </Transition>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Wrapper exterior ── */
.theme-wrapper {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  cursor: pointer;
  border-radius: 999px;
  padding: 3px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Borde con glow según tema */
.wrapper--violet {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(109, 40, 217, 0.3));
  box-shadow:
    0 0 0 1px rgba(167, 139, 250, 0.3),
    0 4px 20px rgba(139, 92, 246, 0.25);
}

.wrapper--navy {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(29, 78, 216, 0.3));
  box-shadow:
    0 0 0 1px rgba(96, 165, 250, 0.3),
    0 4px 20px rgba(59, 130, 246, 0.25);
}

.theme-wrapper:hover {
  transform: translateY(-1px) scale(1.02);
}

.theme-wrapper:active {
  transform: scale(0.97);
}

/* ── Track interior ── */
.track {
  position: relative;
  display: flex;
  align-items: center;
  width: 160px;
  height: 38px;
  border-radius: 999px;
  background: rgba(10, 10, 20, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  padding: 0 4px;
  user-select: none;
}

/* ── Labels de cada lado ── */
.track-label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  opacity: 0.3;
  pointer-events: none;
}

.label--violet {
  left: 12px;
  color: #a78bfa;
}

.label--navy {
  right: 12px;
  color: #60a5fa;
}

/* Label activa */
.track-label.active {
  opacity: 1;
}

/* ── Thumb (círculo deslizante) ── */
.thumb {
  position: absolute;
  width: 34px;
  height: 30px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Transición tipo iPhone */
  transition:
    left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    background 0.4s ease,
    box-shadow 0.4s ease;
  z-index: 2;
}

/* Posición IZQUIERDA = Violeta */
.thumb--violet {
  left: 4px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  box-shadow:
    0 2px 12px rgba(139, 92, 246, 0.6),
    0 0 0 1px rgba(167, 139, 250, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Posición DERECHA = Navy */
.thumb--navy {
  left: calc(100% - 38px);
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow:
    0 2px 12px rgba(59, 130, 246, 0.6),
    0 0 0 1px rgba(96, 165, 250, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Efecto "squeeze" al hacer click como iPhone */
.theme-wrapper:active .thumb {
  width: 40px;
}

/* ── Icono dentro del thumb ── */
.thumb-icon {
  color: #ffffff;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}

/* ── Transición de iconos ── */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-30deg);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(30deg);
}
</style>
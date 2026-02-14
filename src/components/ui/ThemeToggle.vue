<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  theme: 'violet' | 'navy'
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const icon = computed(() => props.theme === 'violet' ? '🌊' : '💜')
const label = computed(() => props.theme === 'violet' ? 'Modo Océano' : 'Modo Violeta')

</script>

<template>
  <button class="theme-toggle" @click="emit('toggle')" :title="label">
    <span class="icon">{{ icon }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.icon {
  font-size: 1.2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-toggle:hover .icon {
  transform: rotate(360deg);
}
</style>

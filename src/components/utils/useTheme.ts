import { ref, computed, watch } from 'vue'

type Theme = 'violet' | 'navy'

const THEMES = {
  violet: {
    accent:       '#22c55e',
    accentDark:   '#16a34a',
    accentLight:  '#86efac',
    accentGlowRgb: '34,197,94',
    top: '#16a34a',
    bottom: '#86efac',
  },
  navy: {
    accent:       '#3b82f6',
    accentDark:   '#1d4ed8',
    accentLight:  '#93c5fd',
    accentGlowRgb: '59,130,246',
    top: '#0A2463',
    bottom: '#3E92CC',
  },
}

function applyThemeCSSVars(t: Theme) {
  const c = THEMES[t]
  const root = document.documentElement
  root.style.setProperty('--accent',          c.accent)
  root.style.setProperty('--accent-dark',     c.accentDark)
  root.style.setProperty('--accent-light',    c.accentLight)
  root.style.setProperty('--accent-glow-rgb', c.accentGlowRgb)
}

const theme = ref<Theme>('violet')

if (typeof document !== 'undefined') {
  applyThemeCSSVars(theme.value)
  watch(theme, applyThemeCSSVars)
}

export const useTheme = () => {
  const themeColors = computed(() => ({
    top:    THEMES[theme.value].top,
    bottom: THEMES[theme.value].bottom,
  }))

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  return { theme, themeColors, setTheme }
}

import { ref, computed } from 'vue'

type Theme = 'violet' | 'navy'

const theme = ref<Theme>('violet')

export const useTheme = () => {
    const themeColors = computed(() => {
        return theme.value === 'violet'
            ? { top: '#5227FF', bottom: '#FF9FFC' } // Violet/rosa theme
            : { top: '#0A2463', bottom: '#3E92CC' } // Navy theme
    })

    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme
    }

    return {
        theme,
        themeColors,
        setTheme
    }
}

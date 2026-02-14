import { ref } from 'vue'

const isAboutOpen = ref(false)

export function useUIState() {
    const toggleAbout = () => {
        isAboutOpen.value = !isAboutOpen.value
    }

    const closeAbout = () => {
        isAboutOpen.value = false
    }

    const openAbout = () => {
        isAboutOpen.value = true
    }

    return {
        isAboutOpen,
        toggleAbout,
        closeAbout,
        openAbout
    }
}

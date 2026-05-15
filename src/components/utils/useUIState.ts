import { ref } from 'vue'

const isAboutOpen = ref(false)
const isProjectsOpen = ref(false)
const isContactOpen = ref(false)

export function useUIState() {
    const closeAll = () => {
        isAboutOpen.value = false
        isProjectsOpen.value = false
        isContactOpen.value = false
    }

    const toggleAbout = () => {
        const next = !isAboutOpen.value
        closeAll()
        isAboutOpen.value = next
    }

    const closeAbout = () => { isAboutOpen.value = false }
    const openAbout = () => { closeAll(); isAboutOpen.value = true }

    const toggleProjects = () => {
        const next = !isProjectsOpen.value
        closeAll()
        isProjectsOpen.value = next
    }

    const closeProjects = () => { isProjectsOpen.value = false }
    const openProjects = () => { closeAll(); isProjectsOpen.value = true }

    const toggleContact = () => {
        const next = !isContactOpen.value
        closeAll()
        isContactOpen.value = next
    }

    const closeContact = () => { isContactOpen.value = false }
    const openContact = () => { closeAll(); isContactOpen.value = true }

    return {
        isAboutOpen,
        isProjectsOpen,
        isContactOpen,
        toggleAbout,
        closeAbout,
        openAbout,
        toggleProjects,
        closeProjects,
        openProjects,
        toggleContact,
        closeContact,
        openContact,
        closeAll
    }
}

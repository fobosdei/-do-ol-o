import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useCursorTracking() {
    const x = ref(0)
    const y = ref(0)
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    const handleMouseMove = (event: MouseEvent) => {
        x.value = event.clientX
        y.value = event.clientY
    }

    const handleResize = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    onMounted(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('resize', handleResize)
    })

    return { x, y, width, height }
}

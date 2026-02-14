import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'

export function useSmoothScroll() {
    let lenis: Lenis | null = null

    onMounted(() => {
        // Initialize Lenis
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })

        // Animation loop for Lenis
        function raf(time: number) {
            lenis?.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    })

    // Cleanup on unmount
    onUnmounted(() => {
        lenis?.destroy()
        lenis = null
    })

    return {
        lenis
    }
}

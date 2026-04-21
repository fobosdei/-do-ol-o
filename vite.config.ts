import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',
  publicDir: 'public',
  // Explicitly mark .fbx as a static asset so Vite never tries to transform it.
  // Files under /public/ are copied as-is to the build output root, so the
  // dragon-skull model stays reachable at /dragon-skull-2/source/dragon-skull-2.fbx
  // in production (Vercel), matching the path used in DragonSkull.vue.
  assetsInclude: ['**/*.fbx'],
  build: {
    // Large binary assets (the FBX is ~31 MB) should not be inlined.
    assetsInlineLimit: 0,
    // Avoid warnings on our Three.js bundle; doesn't change correctness.
    chunkSizeWarningLimit: 2000,
  },
})

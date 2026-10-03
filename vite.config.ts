import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/') || id.includes('/node_modules/@react-three/')) return 'event-case-3d'
          if (id.includes('/node_modules/gsap/') || id.includes('/node_modules/lenis/')) return 'scroll-motion'
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) return 'react-vendor'
        },
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/Azkar/',
  resolve: {
    alias: {
      '@azkar/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url))
    }
  },
  plugins: [
    react()
    // Service Worker temporary disabled to clear old backend-seeking caches
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
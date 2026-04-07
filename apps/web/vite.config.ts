import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/Azkar/', // Explicit absolute path for GitHub Pages
  resolve: {
    alias: {
      '@azkar/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url))
    }
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets'
  }
})
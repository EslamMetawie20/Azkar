import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/', 
  resolve: {
    alias: {
      '@azkar/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url))
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.jpg', 'bismilah.png', 'bismilah3.png'],
      manifest: {
        name: 'Azkar - الأذكار',
        short_name: 'Azkar',
        description: 'Arabic Adhkar & Duas App (Offline-first)',
        theme_color: '#059669',
        icons: [
          {
            src: 'favicon.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'favicon.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-v3-[hash].js`,
        chunkFileNames: `assets/[name]-v3-[hash].js`,
        assetFileNames: `assets/[name]-v3-[hash].[ext]`
      }
    }
  }
})
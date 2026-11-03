import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import markdown from './plugins/vite-plugin-markdown.js'
import imageVariants from './plugins/vite-plugin-image-variants.js'

export default defineConfig({
  plugins: [markdown(), imageVariants(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  // manifest dipakai scripts/prerender.mjs untuk memuat file JS halaman lebih awal (modulepreload).
  build: {
    manifest: true,
  },
})

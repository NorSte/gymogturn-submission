import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  //base: './', // For Electron
  plugins: [react()],
  base: "/pamelding/", // For GitHub Pages
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
})

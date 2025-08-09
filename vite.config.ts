import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  base: '/', // For Electron/Vercel
  //base: "/pamelding/", // For GitHub Pages
  plugins: [react()],
  resolve: {
    alias: {
      // hvor er vi ? -- base
      '@': path.resolve(__dirname, 'src'),
    },
  },
})

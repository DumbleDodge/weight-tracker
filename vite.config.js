import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './', // <--- IMPORTANTE: Punto y barra
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Weight Tracker',
        short_name: 'Tracker',
        description: 'Registra y visualiza tu peso',
        theme_color: '#0f172a', // El color de fondo oscuro de nuestra app
        background_color: '#0f172a',
        display: 'standalone', // <--- ESTO QUITA LA BARRA DEL NAVEGADOR
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png', // Ruta relativa a la carpeta public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
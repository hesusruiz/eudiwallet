import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        credentials: resolve(__dirname, 'pages/credentials/index.html'),
        scan: resolve(__dirname, 'pages/scan.html'),
        presentation: resolve(__dirname, 'pages/presentation.html'),
        settings: resolve(__dirname, 'pages/settings.html'),
      },
    },
  },
  
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src', 
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'EUDI Wallet',
        short_name: 'EUDI Wallet',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      } 
    })
  ]
});

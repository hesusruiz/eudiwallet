import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Set the project root to 'src'
  root: 'src',
  publicDir: '../public', 
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        credentials: resolve(__dirname, 'src/pages/credentials/index.html'),
        scan: resolve(__dirname, 'src/pages/scan.html'),
        presentation: resolve(__dirname, 'src/pages/presentation.html'),
      },
    },
  },
  
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: '.', // Relative to new root (src)
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: false 
    })
  ]
});

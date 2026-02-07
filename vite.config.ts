import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Unfonts from 'unplugin-fonts/vite'

// !Important: always externalize `shiki/onig.wasm`
const externalDependencies: string[] = ['shiki/onig.wasm']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Unfonts({
      google: {
        preconnectUrl: 'https://fonts.bunny.net',
        fontBaseUrl: 'https://fonts.bunny.net/css',
        families: [
          {
            name: 'Space Grotesk',
            styles: 'wght@300..700',
          },
          {
            name: 'JetBrains Mono',
            styles: 'wght@400;500',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      external: externalDependencies,
    },
  },
})

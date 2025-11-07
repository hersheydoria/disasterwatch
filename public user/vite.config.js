import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: [
      'object-assign', 
      'point-in-polygon', 
      'rbush', 
      'earcut', 
      'geojson-rbush', 
      'deep-equal',
      'geojson-equality',
      'density-clustering',
      'skmeans'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  define: {
    global: 'globalThis'
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  envDir: path.resolve(__dirname, '..'),
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

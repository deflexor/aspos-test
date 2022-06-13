import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePluginNode } from 'vite-plugin-node';
// import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  }
})

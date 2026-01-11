import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Build configuration for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps in production for security
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-toastify', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/career-path-api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false
      },
    },
  },

  // Production preview server
  preview: {
    port: 4173,
    host: true
  }
})

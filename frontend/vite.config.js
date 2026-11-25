import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Le contenu du portfolio vit dans ../content/portfolio.json (partagé avec Laravel).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@content': fileURLToPath(new URL('../content', import.meta.url)),
    },
  },
  server: {
    fs: { allow: ['..'] },
    // En local, /api est redirigé vers Laravel (php artisan serve, port 8000)
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})

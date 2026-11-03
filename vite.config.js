import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
const backend = {
  target: 'http://localhost:3000',
  bypass: (req) => (req.headers.accept?.includes('text/html') ? '/index.html' : null),
}
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/usuarios': backend,
      '/alumnos': backend,
      '/materias': backend,
      '/inscripciones': backend,
      '/carreras': backend,
    },
  },
})

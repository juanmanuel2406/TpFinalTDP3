import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Las peticiones a la API van al backend (API de alumnos en el puerto 3000).
// Si el navegador pide una página (por ejemplo F5 en /alumnos), se sirve React.
const backend = {
  target: 'http://localhost:3000',
  bypass: (req) => (req.headers.accept?.includes('text/html') ? '/index.html' : null),
}

// https://vite.dev/config/
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

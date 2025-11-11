import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy configuration: forwards requests from frontend (port 5174) to backend (port 4000)
    // This solves CORS issues during development by making the browser think
    // both frontend and backend are on the same origin.
    // Example: fetch('/api/puzzle') → Vite forwards to http://localhost:4000/api/puzzle
    proxy: {
      '/api': 'http://localhost:4000',      // All /api/* requests go to backend
      '/signup': 'http://localhost:4000',   // POST /signup goes to backend
      '/login': 'http://localhost:4000',    // POST /login goes to backend
    },
  },
})

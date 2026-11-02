import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Solo loopback: el backend se llama con localhost:4000 fijo en src/api.js,
    // asi que exponer el dev server en la red no habilita acceso desde otros equipos.
    host: 'localhost',
  },
})

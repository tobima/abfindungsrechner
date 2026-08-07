import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/abfindungsrechner/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      include: ['src/lib/**', 'src/api/**'], // Mide solo la lógica, ignora la UI
      thresholds: {
        lines: 100, // Ponemos 100 para garantizar que explote ahora mismo
        branches: 100
      }
    }
  }
})
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost'

  const paths = ['/connector', '/contact', '/auth']
  const proxy = Object.fromEntries(
    paths.map((path) => [path, { target: apiTarget, changeOrigin: true }]),
  )

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
  }
})

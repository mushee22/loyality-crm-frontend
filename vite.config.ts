import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_BASE_URL || 'https://api.traceflowtech.com/api/'
  const urlObj = new URL(apiUrl)
  const target = urlObj.origin

  return {
    server: {
      proxy: {
        '/storage': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react(), mkcert()],
  }
})

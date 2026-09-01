import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      // VITE_API_BASE_URL=/api 일 때 로컬에서 쿠키·CORS 이슈를 피한다.
      '/api': {
        target: 'https://gilmoa-dev.gyeonseo.com',
        changeOrigin: true,
        secure: true,
      },
      // 개발전용 인증 API는 /api prefix 없이 노출된다. (/dev/auth/login)
      '/dev': {
        target: 'https://gilmoa-dev.gyeonseo.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})

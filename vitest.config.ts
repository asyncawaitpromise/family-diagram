import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['tests/e2e/**/*', 'node_modules/**/*'],
    server: {
      deps: {
        external: ['canvas'],
      },
    },
  },
  resolve: {
    alias: {
      canvas: false,
    },
  },
  define: {
    global: 'globalThis',
  },
})
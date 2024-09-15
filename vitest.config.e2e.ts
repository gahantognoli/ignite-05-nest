import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
// import tsConfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    // tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})

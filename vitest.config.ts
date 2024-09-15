import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    root: './',
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

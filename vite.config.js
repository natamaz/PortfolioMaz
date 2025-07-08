
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/MyProgect/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

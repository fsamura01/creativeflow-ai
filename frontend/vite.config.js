import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/creative-brief': 'http://localhost:3001',
      '/generate-script': 'http://localhost:3001',
      '/generate-storyboard': 'http://localhost:3001',
      '/mentor-review': 'http://localhost:3001',
      '/refine': 'http://localhost:3001',
    },
  },
})

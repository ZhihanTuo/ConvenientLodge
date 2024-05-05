import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': { // Forward to localhost:3000 each time api is encountered
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
})

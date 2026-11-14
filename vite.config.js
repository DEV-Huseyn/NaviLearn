import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/NaviLearn/',

   server: {
    proxy: {
      '/api': {
        target: 'https://dcn481.dcn.tj',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/Novilearn/api')
      }
    }
  }

})

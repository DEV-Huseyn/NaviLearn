import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig({
  base: '/NaviLearn/',
  plugins: [tailwindcss(), react()],
  
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

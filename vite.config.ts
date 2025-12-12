import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { baseUrl } from './src/services/api-client'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // to solve CROS problem .. so can connect to backend server
  server: {
    proxy: {
      '/api': {
        // target: 'https://complaint-app-gvhv.onrender.com',
        target: baseUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

// الرابط الأصلي: /api/authentication/sign-in
// بعد rewrite: /authentication/sign-in
// الرابط النهائي: https://complaint-app-gvhv.onrender.com/authentication/sign-in
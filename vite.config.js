import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // iPad 등 동일 네트워크 기기에서 IP로 접근 가능
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',  // 👈 CHANGE from '/' to './'
  plugins: [react()],
});













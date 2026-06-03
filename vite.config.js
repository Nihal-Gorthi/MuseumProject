import { defineConfig } from 'vite';

export default defineConfig({
  base: '/3D-art-gallery',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: '/main.js',
    },
  },
});

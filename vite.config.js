import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Oraculo/',
  build: {
    rollupOptions: {
      input: ['index.html', 'MindRolePlay/index.html'],
    },
  },
});

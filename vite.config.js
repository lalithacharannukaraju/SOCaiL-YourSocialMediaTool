// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Set the alias to point to the src directory
    },
  },
  build: {
    rollupOptions: {
      external: ['axios'], // Externalize axios
      output: {
        globals: {
          axios: 'axios', // Define global variable for axios
        },
      },
    },
  },
});

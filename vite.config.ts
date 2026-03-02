import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src/Components'),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));

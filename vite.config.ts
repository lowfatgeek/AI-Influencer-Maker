import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the frontend code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.POLLINATIONS_KEY': JSON.stringify(env.POLLINATIONS_KEY),
      // Ensure other process.env usage doesn't crash
      'process.env': {} 
    }
  };
});
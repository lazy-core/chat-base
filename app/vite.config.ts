import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // This tells the Vite dev server to allow requests from any host.
    // If you want to restrict it to just your domain, you can use:
    // allowedHosts: ['chat.base.lazycore.io']
    allowedHosts: true,
    hmr: {
      host: 'chat.base.lazycore.io'
    }
  },
  // The preview block only applies when running "vite preview"
  preview: {
    allowedHosts: true
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/graphql": {
        target: "https://api-dev.shopi.co.ke",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
  commonjsOptions: {
    esmExternals: true,
  },
}
})

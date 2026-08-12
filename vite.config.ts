import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'
// @ts-ignore
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    // @ts-ignore
    https: true
  }
})

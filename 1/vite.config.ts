import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    // allows temporary tunnels (e.g. localtunnel's *.loca.lt) for testing on
    // real mobile devices, where YouTube embeds need a real HTTPS origin.
    allowedHosts: ['.loca.lt'],
  },
})

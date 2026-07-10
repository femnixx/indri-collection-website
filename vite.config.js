import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
<<<<<<< HEAD
})
=======
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
>>>>>>> bc207850476d2bcf910d8720205df7d223491e7d

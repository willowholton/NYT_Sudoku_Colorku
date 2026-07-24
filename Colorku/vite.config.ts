import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/NYT_Sudoku_Colorku/',
  plugins: [react()],
})

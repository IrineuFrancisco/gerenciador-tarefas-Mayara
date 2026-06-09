import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou vue, etc

export default defineConfig({
  plugins: [react()],
  base: "/gerenciador-tarefas-Mayara/", 
})
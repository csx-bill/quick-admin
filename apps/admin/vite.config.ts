import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      port: env.VITE_PORT, // 使用环境变量端口
      proxy: {
        '/api': {
          target: env.VITE_BASE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/files': {
          target: env.VITE_BASE,
          changeOrigin: true
        }
      }
    }
  }
})

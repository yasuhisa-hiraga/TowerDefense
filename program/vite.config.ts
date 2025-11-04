import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 絶対pathでimportできるように修正 
  resolve: {
    alias: {
      // プロジェクトのルートからの相対パスでエイリアスを設定
      '@': path.resolve(__dirname, './src'), 
    },
  },
  // ----

  esbuild: {
    // 以下の関数呼び出しをビルド時に削除する
    pure: ['console.log', 'console.info'],
  },
  build: {
    minify: 'esbuild', // esbuild のミニファイアを使用
  },
})

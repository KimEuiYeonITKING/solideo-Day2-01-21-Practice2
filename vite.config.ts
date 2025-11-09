import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 배포를 위한 base 경로 설정
  // 저장소 이름에 맞게 수정하세요
  base: '/solideo-Day2-01-21-Practice2/',
})

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 필요에 따라 추가 설정
  envPrefix: "REACT_APP_", // 환경 변수 prefix 변경 등
  server: {
    proxy: {
      "/api": "http://localhost:5174",
    },
  },
  build: {
    outDir: "build", // 빌드 출력 디렉토리 설정
  },
});

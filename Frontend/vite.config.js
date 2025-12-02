import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // ✅ Render sẽ dùng thư mục này để phục vụ file tĩnh
  },
  server: {
    port: parseInt(process.env.VITE_PORT) || 5173,
    open: true, // mở trình duyệt khi chạy npm run dev (tùy chọn)
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/Components", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
    },
  },
});

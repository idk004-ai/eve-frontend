import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Dev-only proxy để né CORS trong lúc chưa triển khai gateway + CORS.
// FE luôn gọi path tương đối (vd fetch('/api/booking/v1/bookings')),
// Vite forward sang service tương ứng và bỏ prefix /api/<service>.
// LƯU Ý: target phải khớp port thực tế đang chạy của từng service.
// Port khớp với ./port-forward.sh (kubectl port-forward từ namespace eve-dev)
const proxyTargets: Record<string, string> = {
  "bus-operator": "http://localhost:9091",
  fleet: "http://localhost:9098",
  route: "http://localhost:9093",
  "seat-inventory": "http://localhost:9094",
  user: "http://localhost:9095",
  booking: "http://localhost:9096",
  payment: "http://localhost:9097",
};

const proxy = Object.fromEntries(
  Object.entries(proxyTargets).map(([name, target]) => [
    `/api/${name}`,
    {
      target,
      changeOrigin: true,
      rewrite: (p: string) => p.replace(new RegExp(`^/api/${name}`), ""),
    },
  ]),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy,
  },
});

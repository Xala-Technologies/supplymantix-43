
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@state": path.resolve(__dirname, "./src/state"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@localization": path.resolve(__dirname, "./src/localization"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@providers": path.resolve(__dirname, "./src/providers"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@themes": path.resolve(__dirname, "./src/themes"),
      "@compliance": path.resolve(__dirname, "./src/compliance"),
      "@integrations": path.resolve(__dirname, "./src/integrations"),
    },
  },
  optimizeDeps: {
    exclude: ['lovable-tagger'],
  },
}));

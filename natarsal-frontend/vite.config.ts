import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes("node_modules")) {
            if (
              id.match(
                /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-redux|@reduxjs|use-sync-external-store|redux|redux-thunk|reselect|immer)[\\/]/,
              )
            ) {
              return "vendor-react";
            }
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "vendor-i18n";
            }
            return "vendor";
          }
        },
      },
    },
  },
});

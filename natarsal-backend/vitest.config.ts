// D:/natarsal/natarsal-backend/vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 10000,
    hookTimeout: 20000,
    retry: 2,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov", "clover"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/tests/**",
        "**/index.ts",
        "**/types/**",
        "**/prisma/**",
        "**/api/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

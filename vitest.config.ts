import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest is intentionally scoped to pure-logic units only (lib/**). We
 * deliberately avoid pulling in jsdom / React testing for now — the React
 * surface is mostly server components and is verified by `tsc --noEmit`
 * and the runtime PDF endpoint instead.
 */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

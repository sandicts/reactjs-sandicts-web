import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude, "e2e/**"],
    restoreMocks: true,
    setupFiles: ["./test/setup.ts"],
  },
});

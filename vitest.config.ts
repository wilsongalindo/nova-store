import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/filter-*.test.ts", "__tests__/cart-store.test.ts"],
  },
  resolve: {
    alias: [
      {
        find: "@/types",
        replacement: path.resolve(__dirname, "./src/types/index.ts"),
      },
      {
        find: /^@\/features\/(.+)$/,
        replacement: `${path.resolve(__dirname, "./src/features")}/$1`,
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "."),
      },
    ],
  },
});

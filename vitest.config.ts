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
        find: "@/lib/format-price",
        replacement: path.resolve(__dirname, "./src/lib/format-price.ts"),
      },
      {
        find: "@/lib/products",
        replacement: path.resolve(__dirname, "./src/lib/products.ts"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "."),
      },
    ],
  },
});

import type { FilterState, Product } from "@/types";

export function filterProducts(
  products: Product[],
  _filters: FilterState,
): Product[] {
  return products;
}

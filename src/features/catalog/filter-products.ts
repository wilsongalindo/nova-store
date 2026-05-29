import type { Product } from "@/types";
import type { FilterState, SortOption } from "@/types";

/**
 * Returns whether a product matches the search query (name or description).
 */
export function matchesSearch(product: Product, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const haystack = `${product.name} ${product.description}`.toLowerCase();

  return haystack.includes(normalizedQuery);
}

/**
 * Returns whether a product matches all active filter criteria (excluding sort).
 */
export function matchesFilters(product: Product, filters: FilterState): boolean {
  if (!matchesSearch(product, filters.search)) {
    return false;
  }

  if (filters.category && product.category !== filters.category) {
    return false;
  }

  if (product.price < filters.minPrice || product.price > filters.maxPrice) {
    return false;
  }

  if (
    filters.inventoryStatus &&
    product.inventoryStatus !== filters.inventoryStatus
  ) {
    return false;
  }

  return true;
}

/**
 * Returns a new array sorted by the given strategy.
 * `newest` preserves the original catalog order.
 */
export function sortProducts(
  products: Product[],
  sort: SortOption,
  originalOrder: readonly string[] = products.map((product) => product.id),
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating_desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort(
        (a, b) =>
          originalOrder.indexOf(a.id) - originalOrder.indexOf(b.id),
      );
    default:
      return sorted;
  }
}

/**
 * Filters and sorts products according to {@link FilterState}.
 * Does not mutate the input array.
 */
export function filterProducts(
  products: Product[],
  filters: FilterState,
): Product[] {
  const originalOrder = products.map((product) => product.id);
  const filtered = products.filter((product) =>
    matchesFilters(product, filters),
  );

  return sortProducts(filtered, filters.sort, originalOrder);
}

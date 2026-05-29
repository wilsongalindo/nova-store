import type { InventoryStatus } from "./product";

/**
 * Available sort strategies for the product catalog.
 */
export type SortOption = "price_asc" | "price_desc" | "rating_desc" | "newest";

/**
 * Catalog filter state synchronized with URL search params.
 */
export interface FilterState {
  /** Free-text search query matched against product name and description. */
  search: string;
  /** Selected category slug, or `null` to include all categories. */
  category: string | null;
  /** Minimum price inclusive bound. */
  minPrice: number;
  /** Maximum price inclusive bound. */
  maxPrice: number;
  /** Filter by inventory status, or `null` to include all statuses. */
  inventoryStatus: InventoryStatus | null;
  /** Active sort strategy. */
  sort: SortOption;
}

/** Default sort applied when no sort param is present. */
export const DEFAULT_SORT: SortOption = "newest";

/** Canonical list of sort options for select controls. */
export const SORT_OPTIONS: readonly SortOption[] = [
  "price_asc",
  "price_desc",
  "rating_desc",
  "newest",
] as const;

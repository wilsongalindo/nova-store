import type { InventoryStatus, Product } from "@/types";
import {
  DEFAULT_SORT,
  SORT_OPTIONS,
  type FilterState,
  type SortOption,
} from "@/types";

export interface PriceBounds {
  min: number;
  max: number;
}

const INVENTORY_STATUSES: readonly InventoryStatus[] = [
  "in_stock",
  "low_stock",
  "out_of_stock",
] as const;

function clampPrice(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseSortParam(value: string | null): SortOption {
  if (value && SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption;
  }

  return DEFAULT_SORT;
}

function parseInventoryParam(value: string | null): InventoryStatus | null {
  if (value && INVENTORY_STATUSES.includes(value as InventoryStatus)) {
    return value as InventoryStatus;
  }

  return null;
}

function parsePriceParam(
  value: string | null,
  fallback: number,
  bounds: PriceBounds,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return clampPrice(parsed, bounds.min, bounds.max);
}

/**
 * Derives inclusive min/max price bounds from a product list.
 */
export function getCatalogPriceBounds(products: Product[]): PriceBounds {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map((product) => product.price);

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

/**
 * Returns the default filter state for a catalog with the given price bounds.
 */
export function getDefaultFilters(bounds: PriceBounds): FilterState {
  return {
    search: "",
    category: null,
    minPrice: bounds.min,
    maxPrice: bounds.max,
    inventoryStatus: null,
    sort: DEFAULT_SORT,
  };
}

/**
 * Parses URL search params into a typed {@link FilterState}.
 */
export function parseFilterParams(
  params: URLSearchParams,
  bounds: PriceBounds,
): FilterState {
  const defaults = getDefaultFilters(bounds);

  const minPrice = parsePriceParam(
    params.get("minPrice"),
    defaults.minPrice,
    bounds,
  );
  const maxPrice = parsePriceParam(
    params.get("maxPrice"),
    defaults.maxPrice,
    bounds,
  );

  return {
    search: params.get("q")?.trim() ?? defaults.search,
    category: params.get("category") || null,
    minPrice: Math.min(minPrice, maxPrice),
    maxPrice: Math.max(minPrice, maxPrice),
    inventoryStatus: parseInventoryParam(params.get("inventory")),
    sort: parseSortParam(params.get("sort")),
  };
}

/**
 * Serializes {@link FilterState} to URL search params, omitting default values.
 */
export function serializeFilterParams(
  filters: FilterState,
  bounds: PriceBounds,
): URLSearchParams {
  const defaults = getDefaultFilters(bounds);
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("q", filters.search.trim());
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.minPrice !== defaults.minPrice) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice !== defaults.maxPrice) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.inventoryStatus) {
    params.set("inventory", filters.inventoryStatus);
  }

  if (filters.sort !== defaults.sort) {
    params.set("sort", filters.sort);
  }

  return params;
}

/**
 * Merges a partial filter patch into the current state immutably.
 */
export function mergeFilters(
  current: FilterState,
  patch: Partial<FilterState>,
): FilterState {
  const merged: FilterState = {
    ...current,
    ...patch,
  };

  if (merged.minPrice > merged.maxPrice) {
    const swappedMin = merged.maxPrice;
    const swappedMax = merged.minPrice;

    return {
      ...merged,
      minPrice: swappedMin,
      maxPrice: swappedMax,
    };
  }

  return merged;
}

/**
 * Counts how many filters differ from their default values.
 */
export function countActiveFilters(
  filters: FilterState,
  bounds: PriceBounds,
): number {
  const defaults = getDefaultFilters(bounds);
  let count = 0;

  if (filters.search.trim()) count += 1;
  if (filters.category) count += 1;
  if (filters.minPrice !== defaults.minPrice) count += 1;
  if (filters.maxPrice !== defaults.maxPrice) count += 1;
  if (filters.inventoryStatus) count += 1;
  if (filters.sort !== defaults.sort) count += 1;

  return count;
}

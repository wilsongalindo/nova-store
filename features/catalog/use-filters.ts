"use client";

import type { FilterState } from "@/types";

export function useFilters(): FilterState {
  return {
    q: "",
    category: null,
    minPrice: 0,
    maxPrice: 0,
    inStockOnly: false,
    sort: "name",
  };
}

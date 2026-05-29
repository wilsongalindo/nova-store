"use client";

import type { FilterState } from "@/types";

export function useFilters(): FilterState {
  return {
    search: "",
    category: null,
    minPrice: 0,
    maxPrice: 0,
    inventoryStatus: null,
    sort: "newest",
  };
}

"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FilterState } from "@/types";

import {
  countActiveFilters,
  getDefaultFilters,
  mergeFilters,
  parseFilterParams,
  serializeFilterParams,
  type PriceBounds,
} from "./filter-params";

export function useFilters(priceBounds: PriceBounds) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilterParams(searchParams, priceBounds),
    [searchParams, priceBounds],
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters, priceBounds),
    [filters, priceBounds],
  );

  const setFilter = useCallback(
    (patch: Partial<FilterState>) => {
      const nextFilters = mergeFilters(filters, patch);
      const params = serializeFilterParams(nextFilters, priceBounds);
      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      router.replace(href, { scroll: false });
    },
    [filters, pathname, priceBounds, router],
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    setFilter,
    resetFilters,
    activeFilterCount,
    defaultFilters: getDefaultFilters(priceBounds),
  };
}

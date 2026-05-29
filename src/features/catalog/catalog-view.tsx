"use client";

import { useMemo } from "react";

import type { Product } from "@/types";

import { FilterBar } from "./filter-bar";
import { filterProducts } from "./filter-products";
import type { PriceBounds } from "./filter-params";
import { ProductGrid } from "./product-grid";
import { useFilters } from "./use-filters";

export interface CatalogViewProps {
  products: Product[];
  categories: string[];
  priceBounds: PriceBounds;
}

export function CatalogView({
  products,
  categories,
  priceBounds,
}: CatalogViewProps) {
  const { filters, setFilter, resetFilters, activeFilterCount } =
    useFilters(priceBounds);

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  );

  return (
    <>
      <FilterBar
        categories={categories}
        priceBounds={priceBounds}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />
      <ProductGrid
        products={filteredProducts}
        emptyState={{
          title: "No products found",
          description: "Try adjusting your filters or search terms.",
        }}
      />
    </>
  );
}

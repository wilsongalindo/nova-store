"use client";

import { useEffect, useId, useState } from "react";
import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { FilterState, InventoryStatus } from "@/types";
import { SORT_OPTIONS } from "@/types";

import type { PriceBounds } from "./filter-params";

const SEARCH_DEBOUNCE_MS = 300;

const INVENTORY_OPTIONS: { value: InventoryStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const SORT_LABELS: Record<(typeof SORT_OPTIONS)[number], string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating_desc: "Highest Rated",
};

function formatPriceLabel(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export interface FilterBarProps {
  categories: string[];
  priceBounds: PriceBounds;
  filters: FilterState;
  activeFilterCount: number;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export function FilterBar({
  categories,
  priceBounds,
  filters,
  activeFilterCount,
  onFilterChange,
  onReset,
  className,
}: FilterBarProps) {
  const searchId = useId();
  const categoryId = useId();
  const inventoryId = useId();
  const sortId = useId();
  const priceId = useId();

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput.trim() !== filters.search.trim()) {
        onFilterChange({ search: searchInput.trim() });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, filters.search, onFilterChange]);

  return (
    <section
      aria-label="Product filters"
      className={cn(
        "mb-8 rounded-xl border bg-card p-4 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">Filters</h2>
        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground"
          >
            <RotateCcw aria-hidden="true" />
            Clear filters ({activeFilterCount})
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2 md:col-span-2 xl:col-span-4">
          <label htmlFor={searchId} className="text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id={searchId}
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor={categoryId} className="text-sm font-medium">
            Category
          </label>
          <Select
            value={filters.category ?? "all"}
            onValueChange={(value) =>
              onFilterChange({ category: value === "all" ? null : value })
            }
          >
            <SelectTrigger id={categoryId} className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor={inventoryId} className="text-sm font-medium">
            Inventory
          </label>
          <Select
            value={filters.inventoryStatus ?? "all"}
            onValueChange={(value) =>
              onFilterChange({
                inventoryStatus:
                  value === "all" ? null : (value as InventoryStatus),
              })
            }
          >
            <SelectTrigger id={inventoryId} className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {INVENTORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor={sortId} className="text-sm font-medium">
            Sort by
          </label>
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              onFilterChange({ sort: value as FilterState["sort"] })
            }
          >
            <SelectTrigger id={sortId} className="w-full">
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {SORT_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 md:col-span-2 xl:col-span-4">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={priceId} className="text-sm font-medium">
              Price range
            </label>
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatPriceLabel(filters.minPrice)} –{" "}
              {formatPriceLabel(filters.maxPrice)}
            </span>
          </div>
          <Slider
            id={priceId}
            aria-label="Price range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={1}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([minPrice, maxPrice]) =>
              onFilterChange({ minPrice, maxPrice })
            }
            disabled={priceBounds.min === priceBounds.max}
          />
        </div>
      </div>
    </section>
  );
}

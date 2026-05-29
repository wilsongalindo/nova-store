import { describe, expect, it } from "vitest";

import type { Product } from "@/types";
import type { FilterState } from "@/types";

import {
  filterProducts,
  matchesFilters,
  matchesSearch,
  sortProducts,
} from "@/features/catalog/filter-products";

const mockProducts: Product[] = [
  {
    id: "prod-a",
    slug: "alpha-phone",
    name: "Alpha Phone",
    description: "A smart phone with wireless charging",
    category: "Electronics",
    images: ["https://example.com/a.jpg"],
    price: 100,
    rating: 4.5,
    reviewCount: 100,
    inventoryStatus: "in_stock",
    variants: [],
  },
  {
    id: "prod-b",
    slug: "beta-jacket",
    name: "Beta Jacket",
    description: "Warm winter jacket",
    category: "Fashion",
    images: ["https://example.com/b.jpg"],
    price: 200,
    rating: 3.8,
    reviewCount: 50,
    inventoryStatus: "low_stock",
    promotionBadge: "Sale",
    variants: [],
  },
  {
    id: "prod-c",
    slug: "gamma-yoga-mat",
    name: "Gamma Yoga Mat",
    description: "Premium yoga mat for fitness",
    category: "Sports",
    images: ["https://example.com/c.jpg"],
    price: 50,
    rating: 4.9,
    reviewCount: 300,
    inventoryStatus: "out_of_stock",
    variants: [],
  },
];

const defaultFilters: FilterState = {
  search: "",
  category: null,
  minPrice: 0,
  maxPrice: 500,
  inventoryStatus: null,
  sort: "newest",
};

describe("matchesSearch", () => {
  it("matches product name case-insensitively", () => {
    expect(matchesSearch(mockProducts[0], "alpha")).toBe(true);
  });

  it("matches product description", () => {
    expect(matchesSearch(mockProducts[0], "wireless")).toBe(true);
  });

  it("returns true for empty query", () => {
    expect(matchesSearch(mockProducts[0], "  ")).toBe(true);
  });

  it("returns false when no match", () => {
    expect(matchesSearch(mockProducts[0], "camera")).toBe(false);
  });
});

describe("matchesFilters", () => {
  it("filters by category", () => {
    expect(
      matchesFilters(mockProducts[0], { ...defaultFilters, category: "Fashion" }),
    ).toBe(false);
    expect(
      matchesFilters(mockProducts[1], { ...defaultFilters, category: "Fashion" }),
    ).toBe(true);
  });

  it("filters by price range", () => {
    expect(
      matchesFilters(mockProducts[0], {
        ...defaultFilters,
        minPrice: 150,
        maxPrice: 500,
      }),
    ).toBe(false);
  });

  it("filters by inventory status", () => {
    expect(
      matchesFilters(mockProducts[2], {
        ...defaultFilters,
        inventoryStatus: "out_of_stock",
      }),
    ).toBe(true);
  });
});

describe("sortProducts", () => {
  it("sorts by price ascending", () => {
    const sorted = sortProducts(mockProducts, "price_asc");
    expect(sorted.map((product) => product.id)).toEqual([
      "prod-c",
      "prod-a",
      "prod-b",
    ]);
  });

  it("sorts by rating descending", () => {
    const sorted = sortProducts(mockProducts, "rating_desc");
    expect(sorted[0].id).toBe("prod-c");
  });

  it("preserves catalog order for newest", () => {
    const sorted = sortProducts(mockProducts, "newest");
    expect(sorted.map((product) => product.id)).toEqual([
      "prod-a",
      "prod-b",
      "prod-c",
    ]);
  });
});

describe("filterProducts", () => {
  it("returns all products with default filters", () => {
    expect(filterProducts(mockProducts, defaultFilters)).toHaveLength(3);
  });

  it("combines search and category filters", () => {
    const result = filterProducts(mockProducts, {
      ...defaultFilters,
      search: "yoga",
      category: "Sports",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("gamma-yoga-mat");
  });

  it("returns empty array when nothing matches", () => {
    expect(
      filterProducts(mockProducts, { ...defaultFilters, search: "nonexistent" }),
    ).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [...mockProducts];
    filterProducts(input, { ...defaultFilters, sort: "price_desc" });
    expect(input.map((product) => product.id)).toEqual([
      "prod-a",
      "prod-b",
      "prod-c",
    ]);
  });
});

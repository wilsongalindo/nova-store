import { describe, expect, it } from "vitest";

import {
  countActiveFilters,
  getCatalogPriceBounds,
  getDefaultFilters,
  mergeFilters,
  parseFilterParams,
  serializeFilterParams,
} from "@/features/catalog/filter-params";
import type { Product } from "@/types";

const bounds = { min: 25, max: 450 };

const sampleProducts: Product[] = [
  {
    id: "1",
    slug: "a",
    name: "A",
    description: "",
    category: "Electronics",
    images: [],
    price: 100,
    rating: 4,
    reviewCount: 10,
    inventoryStatus: "in_stock",
    variants: [],
  },
  {
    id: "2",
    slug: "b",
    name: "B",
    description: "",
    category: "Fashion",
    images: [],
    price: 200,
    rating: 4,
    reviewCount: 10,
    inventoryStatus: "in_stock",
    variants: [],
  },
];

describe("getCatalogPriceBounds", () => {
  it("returns min and max from product prices", () => {
    expect(getCatalogPriceBounds(sampleProducts)).toEqual({ min: 100, max: 200 });
  });

  it("returns zero bounds for empty catalog", () => {
    expect(getCatalogPriceBounds([])).toEqual({ min: 0, max: 0 });
  });
});

describe("getDefaultFilters", () => {
  it("uses bounds for price range", () => {
    expect(getDefaultFilters(bounds)).toEqual({
      search: "",
      category: null,
      minPrice: 25,
      maxPrice: 450,
      inventoryStatus: null,
      sort: "newest",
    });
  });
});

describe("parseFilterParams", () => {
  it("parses all params from URL", () => {
    const params = new URLSearchParams({
      q: "wireless",
      category: "Electronics",
      minPrice: "50",
      maxPrice: "300",
      inventory: "in_stock",
      sort: "price_asc",
    });

    expect(parseFilterParams(params, bounds)).toEqual({
      search: "wireless",
      category: "Electronics",
      minPrice: 50,
      maxPrice: 300,
      inventoryStatus: "in_stock",
      sort: "price_asc",
    });
  });

  it("falls back to defaults for invalid values", () => {
    const params = new URLSearchParams({
      inventory: "invalid",
      sort: "invalid",
      minPrice: "abc",
    });

    expect(parseFilterParams(params, bounds)).toEqual(getDefaultFilters(bounds));
  });
});

describe("serializeFilterParams", () => {
  it("omits default values from URL", () => {
    expect(serializeFilterParams(getDefaultFilters(bounds), bounds).toString()).toBe(
      "",
    );
  });

  it("serializes non-default filters", () => {
    const params = serializeFilterParams(
      {
        search: "phone",
        category: "Electronics",
        minPrice: 50,
        maxPrice: 450,
        inventoryStatus: "low_stock",
        sort: "rating_desc",
      },
      bounds,
    );

    expect(params.get("q")).toBe("phone");
    expect(params.get("category")).toBe("Electronics");
    expect(params.get("minPrice")).toBe("50");
    expect(params.get("inventory")).toBe("low_stock");
    expect(params.get("sort")).toBe("rating_desc");
    expect(params.get("maxPrice")).toBeNull();
  });
});

describe("mergeFilters", () => {
  it("merges partial updates immutably", () => {
    const current = getDefaultFilters(bounds);
    const merged = mergeFilters(current, { search: "test", category: "Fashion" });

    expect(merged.search).toBe("test");
    expect(merged.category).toBe("Fashion");
    expect(current.search).toBe("");
  });

  it("swaps min and max when inverted", () => {
    const merged = mergeFilters(getDefaultFilters(bounds), {
      minPrice: 400,
      maxPrice: 100,
    });

    expect(merged.minPrice).toBe(100);
    expect(merged.maxPrice).toBe(400);
  });
});

describe("countActiveFilters", () => {
  it("returns zero for default filters", () => {
    expect(countActiveFilters(getDefaultFilters(bounds), bounds)).toBe(0);
  });

  it("counts active non-default filters", () => {
    expect(
      countActiveFilters(
        {
          ...getDefaultFilters(bounds),
          search: "phone",
          category: "Electronics",
          sort: "price_asc",
        },
        bounds,
      ),
    ).toBe(3);
  });
});

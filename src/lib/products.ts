import productsJson from "@/data/products.json";
import type { Product } from "@/types";

/**
 * Static product catalog.
 *
 * Single source of truth for the JSON dataset. When migrating to a real API,
 * replace this module-level load with async fetch calls inside each getter.
 */
const catalog: readonly Product[] = productsJson as Product[];

/**
 * Returns every product in the catalog.
 */
export function getProducts(): Product[] {
  return [...catalog];
}

/**
 * Finds a product by its URL slug.
 *
 * @returns The matching product, or `null` when not found.
 */
export function getProductBySlug(slug: string): Product | null {
  return catalog.find((product) => product.slug === slug) ?? null;
}

/**
 * Returns unique category names sorted alphabetically.
 */
export function getCategories(): string[] {
  const categories = new Set(catalog.map((product) => product.category));

  return [...categories].sort((a, b) => a.localeCompare(b));
}

/**
 * Returns products from the same category as the given product,
 * excluding the product itself.
 *
 * @param product - Reference product used to match category.
 * @param limit - Maximum number of related products to return.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return catalog
    .filter(
      (candidate) =>
        candidate.category === product.category &&
        candidate.id !== product.id,
    )
    .slice(0, limit);
}

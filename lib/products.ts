import type { Product } from "@/types";

import products from "@/data/products.json";

export function getProducts(): Product[] {
  return products as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return (products as Product[]).find((product) => product.slug === slug);
}

export function getCategories(): string[] {
  return [];
}

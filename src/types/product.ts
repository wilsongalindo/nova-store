/**
 * Stock availability level for a product.
 */
export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock";

/**
 * A purchasable variant of a product (e.g. size, color).
 */
export interface ProductVariant {
  /** Unique variant identifier. */
  id: string;
  /** Human-readable variant label shown in the UI. */
  label: string;
  /** Stock-keeping unit code. */
  sku: string;
  /** Variant price in the store's base currency. */
  price: number;
  /** Available units for this variant. */
  stock: number;
}

/**
 * Core product entity used across catalog, detail, and cart flows.
 */
export interface Product {
  /** Unique product identifier. */
  id: string;
  /** URL-friendly identifier for routing (`/products/[slug]`). */
  slug: string;
  /** Display name. */
  name: string;
  /** Full product description. */
  description: string;
  /** Category slug or name used for filtering. */
  category: string;
  /** Ordered list of image URLs. */
  images: string[];
  /** Base price in the store's currency (before variant overrides). */
  price: number;
  /** Average customer rating (0–5). */
  rating: number;
  /** Total number of customer reviews. */
  reviewCount: number;
  /** Current stock availability status. */
  inventoryStatus: InventoryStatus;
  /** Optional promotional label (e.g. "Sale", "New"). */
  promotionBadge?: string;
  /** Available purchasable variants; empty when the product has no variants. */
  variants: ProductVariant[];
}

import type { Product, ProductVariant } from "./product";

/**
 * A line item in the shopping cart.
 *
 * Snapshot fields (`name`, `image`, `price`) are denormalized so the cart
 * remains stable if catalog data changes after the item was added.
 */
export interface CartItem {
  /** Reference to the parent product. */
  productId: Product["id"];
  /** Selected variant, or `null` when the product has no variants. */
  variantId: ProductVariant["id"] | null;
  /** Display name at time of add-to-cart. */
  name: string;
  /** Thumbnail URL at time of add-to-cart. */
  image: string;
  /** Unit price at time of add-to-cart. */
  price: number;
  /** Number of units in the cart (minimum 1). */
  quantity: number;
}

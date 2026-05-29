"use client";

import { create } from "zustand";

import type { CartItem, Product, ProductVariant } from "@/types";

/** Cart state slice — persist-ready (actions live outside this shape). */
export interface CartState {
  items: CartItem[];
}

export interface CartActions {
  addItem: (
    product: Product,
    variant?: ProductVariant | null,
    quantity?: number,
  ) => void;
  removeItem: (
    productId: Product["id"],
    variantId?: ProductVariant["id"] | null,
  ) => void;
  updateQuantity: (
    productId: Product["id"],
    quantity: number,
    variantId?: ProductVariant["id"] | null,
  ) => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

/** Payload shared by catalog cards and PDP add-to-cart actions. */
export interface AddToCartPayload {
  product: Product;
  variant: ProductVariant | null;
  price: number;
}

/** Builds a typed add-to-cart payload from catalog data. */
export function buildAddToCartPayload(
  product: Product,
  variant: ProductVariant | null = null,
): AddToCartPayload {
  return {
    product,
    variant,
    price: variant?.price ?? product.price,
  };
}

type VariantId = ProductVariant["id"] | null;

/** Builds a stable key for a cart line (product + variant). */
export function getCartLineKey(
  productId: Product["id"],
  variantId: VariantId,
): string {
  return `${productId}::${variantId ?? "default"}`;
}

/** Returns total unit count across all cart lines. */
export function calculateItemCount(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/** Returns the cart subtotal (sum of line totals). */
export function calculateSubtotal(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function normalizeVariantId(
  variantId?: ProductVariant["id"] | null,
): VariantId {
  return variantId ?? null;
}

function resolveUnitPrice(
  product: Product,
  variant: ProductVariant | null,
): number {
  return variant?.price ?? product.price;
}

function resolveDisplayName(
  product: Product,
  variant: ProductVariant | null,
): string {
  if (!variant) {
    return product.name;
  }

  return `${product.name} — ${variant.label}`;
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

/** Creates a snapshot {@link CartItem} from catalog data. */
export function createCartItem(
  product: Product,
  variant: ProductVariant | null,
  quantity: number,
): CartItem {
  return {
    productId: product.id,
    variantId: variant?.id ?? null,
    name: resolveDisplayName(product, variant),
    image: product.images[0] ?? "",
    price: resolveUnitPrice(product, variant),
    quantity: normalizeQuantity(quantity),
  };
}

function findItemIndex(
  items: readonly CartItem[],
  productId: Product["id"],
  variantId: VariantId,
): number {
  return items.findIndex(
    (item) =>
      item.productId === productId &&
      item.variantId === variantId,
  );
}

/** Pure: returns a new items array with the product added or quantity incremented. */
export function addItemToCart(
  items: readonly CartItem[],
  product: Product,
  variant: ProductVariant | null = null,
  quantity = 1,
): CartItem[] {
  const normalizedVariantId = normalizeVariantId(variant?.id ?? null);
  const safeQuantity = normalizeQuantity(quantity);
  const existingIndex = findItemIndex(items, product.id, normalizedVariantId);

  if (existingIndex === -1) {
    return [
      ...items,
      createCartItem(product, variant, safeQuantity),
    ];
  }

  return items.map((item, index) =>
    index === existingIndex
      ? { ...item, quantity: item.quantity + safeQuantity }
      : item,
  );
}

/** Pure: returns a new items array with the matching line removed. */
export function removeItemFromCart(
  items: readonly CartItem[],
  productId: Product["id"],
  variantId?: ProductVariant["id"] | null,
): CartItem[] {
  const normalizedVariantId = normalizeVariantId(variantId);

  return items.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.variantId === normalizedVariantId
      ),
  );
}

/** Pure: returns a new items array with updated quantity; removes line when quantity <= 0. */
export function updateCartItemQuantity(
  items: readonly CartItem[],
  productId: Product["id"],
  quantity: number,
  variantId?: ProductVariant["id"] | null,
): CartItem[] {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return removeItemFromCart(items, productId, variantId);
  }

  const safeQuantity = Math.floor(quantity);
  const normalizedVariantId = normalizeVariantId(variantId);
  const existingIndex = findItemIndex(items, productId, normalizedVariantId);

  if (existingIndex === -1) {
    return [...items];
  }

  return items.map((item, index) =>
    index === existingIndex ? { ...item, quantity: safeQuantity } : item,
  );
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (product, variant = null, quantity = 1) => {
    set((state) => ({
      items: addItemToCart(state.items, product, variant, quantity),
    }));
  },

  removeItem: (productId, variantId) => {
    set((state) => ({
      items: removeItemFromCart(state.items, productId, variantId),
    }));
  },

  updateQuantity: (productId, quantity, variantId) => {
    set((state) => ({
      items: updateCartItemQuantity(
        state.items,
        productId,
        quantity,
        variantId,
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },
}));

/** Selectors */
export const selectCartItems = (state: CartStore): CartItem[] => state.items;

export const selectCartItemCount = (state: CartStore): number =>
  calculateItemCount(state.items);

export const selectCartSubtotal = (state: CartStore): number =>
  calculateSubtotal(state.items);

/** Selector hooks */
export const useCartItems = () => useCartStore(selectCartItems);

export const useCartItemCount = () => useCartStore(selectCartItemCount);

export const useCartSubtotal = () => useCartStore(selectCartSubtotal);

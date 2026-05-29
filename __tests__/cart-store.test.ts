import { beforeEach, describe, expect, it } from "vitest";

import type { Product } from "@/types";

import {
  addItemToCart,
  calculateItemCount,
  calculateSubtotal,
  createCartItem,
  removeItemFromCart,
  updateCartItemQuantity,
  useCartStore,
} from "@/features/cart/cart-store";

const mockProduct: Product = {
  id: "prod-001",
  slug: "wireless-earbuds",
  name: "Wireless Earbuds",
  description: "Premium earbuds",
  category: "Electronics",
  images: ["https://example.com/earbuds.jpg"],
  price: 149.99,
  rating: 4.7,
  reviewCount: 100,
  inventoryStatus: "in_stock",
  variants: [
    {
      id: "var-black",
      label: "Midnight Black",
      sku: "WEB-BLK",
      price: 149.99,
      stock: 10,
    },
    {
      id: "var-silver",
      label: "Lunar Silver",
      sku: "WEB-SLV",
      price: 154.99,
      stock: 5,
    },
  ],
};

describe("cart calculations", () => {
  it("calculates item count and subtotal", () => {
    const items = [
      createCartItem(mockProduct, null, 2),
      createCartItem(mockProduct, mockProduct.variants[1], 1),
    ];

    expect(calculateItemCount(items)).toBe(3);
    expect(calculateSubtotal(items)).toBeCloseTo(149.99 * 2 + 154.99);
  });
});

describe("pure cart operations", () => {
  it("adds a new item", () => {
    const items = addItemToCart([], mockProduct, null, 1);

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].name).toBe("Wireless Earbuds");
  });

  it("increments quantity for an existing line", () => {
    const initial = addItemToCart([], mockProduct, null, 1);
    const updated = addItemToCart(initial, mockProduct, null, 2);

    expect(updated).toHaveLength(1);
    expect(updated[0].quantity).toBe(3);
  });

  it("keeps separate lines for different variants", () => {
    const items = addItemToCart(
      addItemToCart([], mockProduct, mockProduct.variants[0]),
      mockProduct,
      mockProduct.variants[1],
    );

    expect(items).toHaveLength(2);
  });

  it("removes a specific line", () => {
    const items = addItemToCart([], mockProduct, mockProduct.variants[0]);
    const result = removeItemFromCart(items, mockProduct.id, "var-black");

    expect(result).toHaveLength(0);
  });

  it("removes item when quantity is zero or less", () => {
    const items = addItemToCart([], mockProduct, null, 2);
    const result = updateCartItemQuantity(items, mockProduct.id, 0, null);

    expect(result).toHaveLength(0);
  });

  it("removes item when quantity is not finite", () => {
    const items = addItemToCart([], mockProduct, null, 2);
    const result = updateCartItemQuantity(items, mockProduct.id, NaN, null);

    expect(result).toHaveLength(0);
  });

  it("floors fractional quantities on update", () => {
    const items = addItemToCart([], mockProduct, null, 1);
    const result = updateCartItemQuantity(items, mockProduct.id, 2.9, null);

    expect(result[0].quantity).toBe(2);
  });

  it("ignores update for a line that does not exist", () => {
    const items = addItemToCart([], mockProduct, null, 1);
    const result = updateCartItemQuantity(items, "unknown-id", 5, null);

    expect(result).toEqual(items);
  });

  it("returns zero subtotal and item count for an empty cart", () => {
    expect(calculateItemCount([])).toBe(0);
    expect(calculateSubtotal([])).toBe(0);
  });

  it("does not mutate the input array", () => {
    const items = addItemToCart([], mockProduct, null, 1);
    const snapshot = [...items];
    addItemToCart(items, mockProduct, null, 1);

    expect(items).toEqual(snapshot);
  });
});

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("supports add, update, remove, and clear", () => {
    useCartStore.getState().addItem(mockProduct, null, 1);
    expect(useCartStore.getState().items).toHaveLength(1);

    useCartStore.getState().addItem(mockProduct, null, 1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);

    useCartStore.getState().updateQuantity(mockProduct.id, 5, null);
    expect(useCartStore.getState().items[0].quantity).toBe(5);

    useCartStore.getState().removeItem(mockProduct.id, null);
    expect(useCartStore.getState().items).toHaveLength(0);

    useCartStore.getState().addItem(mockProduct, mockProduct.variants[0]);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

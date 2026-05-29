"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  buildAddToCartPayload,
  useCartStore,
  type AddToCartPayload,
} from "@/features/cart/cart-store";
import { formatPrice } from "@/lib/format-price";
import type { Product, ProductVariant } from "@/types";

export type { AddToCartPayload };

export interface AddToCartButtonProps {
  product: Product;
  variant: ProductVariant | null;
  price: number;
  disabled?: boolean;
  className?: string;
  onAddToCart?: (payload: AddToCartPayload) => void;
}

export function AddToCartButton({
  product,
  variant,
  price,
  disabled = false,
  className,
  onAddToCart,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isDisabled = disabled || product.inventoryStatus === "out_of_stock";

  const handleClick = () => {
    const payload = buildAddToCartPayload(product, variant);

    if (onAddToCart) {
      onAddToCart(payload);
      return;
    }

    addItem(payload.product, payload.variant, 1);
  };

  return (
    <Button
      type="button"
      size="lg"
      className={className}
      disabled={isDisabled}
      aria-label={
        isDisabled
          ? `${product.name} is out of stock`
          : `Add ${product.name} to cart for ${formatPrice(price)}`
      }
      onClick={handleClick}
    >
      <ShoppingCart aria-hidden="true" />
      Add To Cart
    </Button>
  );
}

"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import type { Product, ProductVariant } from "@/types";

export interface AddToCartPayload {
  product: Product;
  variant: ProductVariant | null;
  price: number;
}

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
  const isDisabled = disabled || product.inventoryStatus === "out_of_stock";

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
      onClick={() =>
        onAddToCart?.({
          product,
          variant,
          price,
        })
      }
    >
      <ShoppingCart aria-hidden="true" />
      Add To Cart
    </Button>
  );
}

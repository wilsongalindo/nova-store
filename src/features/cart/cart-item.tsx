"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

import { useCartStore } from "./cart-store";

export interface CartItemRowProps {
  item: CartItem;
  className?: string;
}

const VARIANT_NAME_SEPARATOR = " — ";

function parseCartItemDisplay(item: CartItem): {
  productName: string;
  variantLabel: string | null;
} {
  if (!item.variantId) {
    return { productName: item.name, variantLabel: null };
  }

  const separatorIndex = item.name.indexOf(VARIANT_NAME_SEPARATOR);

  if (separatorIndex === -1) {
    return { productName: item.name, variantLabel: null };
  }

  return {
    productName: item.name.slice(0, separatorIndex),
    variantLabel: item.name.slice(separatorIndex + VARIANT_NAME_SEPARATOR.length),
  };
}

export function CartItemRow({ item, className }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { productName, variantLabel } = parseCartItemDisplay(item);
  const lineSubtotal = item.price * item.quantity;

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1, item.variantId);
  };

  const handleDecrement = () => {
    updateQuantity(item.productId, item.quantity - 1, item.variantId);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.variantId);
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-start",
        className,
      )}
      aria-label={`${productName}, quantity ${item.quantity}`}
    >
      <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:mx-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={productName}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-xs text-muted-foreground"
            aria-hidden="true"
          >
            No image
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-1">
          <h3 className="font-medium leading-snug">{productName}</h3>
          {variantLabel ? (
            <p className="text-sm text-muted-foreground">{variantLabel}</p>
          ) : null}
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatPrice(item.price)} each
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label={`Quantity controls for ${productName}`}
          >
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={
                item.quantity === 1
                  ? `Remove ${productName} from cart`
                  : `Decrease quantity of ${productName}`
              }
              onClick={handleDecrement}
            >
              <Minus aria-hidden="true" />
            </Button>
            <span className="min-w-8 text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={`Increase quantity of ${productName}`}
              onClick={handleIncrement}
            >
              <Plus aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm font-semibold tabular-nums sm:text-base">
              <span className="sr-only">Line subtotal</span>
              {formatPrice(lineSubtotal)}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Remove ${productName} from cart`}
              onClick={handleRemove}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

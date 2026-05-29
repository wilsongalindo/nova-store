"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

import { useCartItemCount, useCartSubtotal } from "./cart-store";

export interface CartSummaryProps {
  className?: string;
  onCheckout?: () => void;
}

export function CartSummary({ className, onCheckout }: CartSummaryProps) {
  const itemCount = useCartItemCount();
  const subtotal = useCartSubtotal();
  const isEmpty = itemCount === 0;

  return (
    <section
      aria-labelledby="cart-summary-title"
      className={cn("space-y-4", className)}
    >
      <h2 id="cart-summary-title" className="text-lg font-semibold tracking-tight">
        Order Summary
      </h2>

      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Total items</dt>
          <dd className="font-medium tabular-nums">{itemCount}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="text-base font-semibold tabular-nums">
            {formatPrice(subtotal)}
          </dd>
        </div>
      </dl>

      <Separator />

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={isEmpty}
        aria-label={
          isEmpty
            ? "Checkout unavailable, cart is empty"
            : `Checkout ${itemCount} item${itemCount === 1 ? "" : "s"} for ${formatPrice(subtotal)}`
        }
        onClick={onCheckout}
      >
        Checkout
      </Button>
    </section>
  );
}

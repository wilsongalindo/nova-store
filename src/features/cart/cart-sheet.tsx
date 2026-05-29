"use client";

import { ShoppingBag } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { CartItemRow } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { getCartLineKey, useCartItemCount, useCartItems } from "./cart-store";

export interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CartEmptyState() {
  return (
    <section
      aria-labelledby="cart-empty-title"
      className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center"
    >
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted"
        aria-hidden="true"
      >
        <ShoppingBag className="size-7 text-muted-foreground" />
      </div>
      <h3
        id="cart-empty-title"
        className="text-base font-semibold tracking-tight"
      >
        Your cart is empty
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Add products to your cart to see them here.
      </p>
    </section>
  );
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const items = useCartItems();
  const itemCount = useCartItemCount();
  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex h-full w-full max-w-full flex-col gap-0 p-0 sm:max-w-md",
        )}
        aria-describedby="cart-sheet-description"
      >
        <SheetHeader className="border-b px-4 py-4 pr-14 text-left">
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription id="cart-sheet-description">
            {isEmpty
              ? "No items in your cart yet."
              : `${itemCount} item${itemCount === 1 ? "" : "s"} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          {isEmpty ? (
            <CartEmptyState />
          ) : (
            <ul
              aria-label="Cart items"
              className="flex list-none flex-col gap-4 p-0 m-0"
            >
              {items.map((item) => (
                <li key={getCartLineKey(item.productId, item.variantId)}>
                  <CartItemRow item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="shrink-0 border-t bg-background px-4 py-4">
          <CartSummary />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

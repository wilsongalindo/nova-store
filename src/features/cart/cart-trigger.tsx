"use client";

import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCartItemCount } from "./cart-store";

export interface CartTriggerProps {
  onClick?: () => void;
  className?: string;
}

function formatBadgeCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}

export function CartTrigger({ onClick, className }: CartTriggerProps) {
  const itemCount = useCartItemCount();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      aria-label={
        itemCount > 0
          ? `Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Open cart"
      }
      onClick={onClick}
    >
      <ShoppingCart className="size-5" aria-hidden="true" />
      {itemCount > 0 ? (
        <Badge
          variant="default"
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex size-5 min-w-5 items-center justify-center rounded-full px-0 text-[0.625rem] font-semibold tabular-nums"
        >
          {formatBadgeCount(itemCount)}
        </Badge>
      ) : null}
    </Button>
  );
}

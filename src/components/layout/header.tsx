"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { CartSheet } from "@/features/cart/cart-sheet";
import { CartTrigger } from "@/features/cart/cart-trigger";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full min-w-0 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Nova Store, go to homepage"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105"
            aria-hidden="true"
          >
            <Sparkles className="size-4" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
              Nova Store
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Modern shopping
            </span>
          </span>
        </Link>

        <nav aria-label="Site actions" className="flex shrink-0 items-center">
          <CartTrigger onClick={() => setCartOpen(true)} />
        </nav>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

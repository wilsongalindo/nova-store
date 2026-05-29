import { PackageOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Product } from "@/types";

import { ProductCard } from "./product-card";

export interface ProductGridEmptyStateProps {
  title?: string;
  description?: string;
}

export interface ProductGridProps {
  products: Product[];
  className?: string;
  /** Overrides copy shown when `products` is empty. */
  emptyState?: ProductGridEmptyStateProps;
}

const DEFAULT_EMPTY_STATE: Required<ProductGridEmptyStateProps> = {
  title: "No products found",
  description: "There are no products to display at the moment.",
};

function ProductGridEmptyState({
  title,
  description,
}: Required<ProductGridEmptyStateProps>) {
  return (
    <section
      aria-labelledby="product-grid-empty-title"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center"
    >
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted"
        aria-hidden="true"
      >
        <PackageOpen className="size-7 text-muted-foreground" />
      </div>
      <h2
        id="product-grid-empty-title"
        className="text-lg font-semibold tracking-tight"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </section>
  );
}

export function ProductGrid({
  products,
  className,
  emptyState,
}: ProductGridProps) {
  if (products.length === 0) {
    const resolvedEmptyState = {
      ...DEFAULT_EMPTY_STATE,
      ...emptyState,
    };

    return (
      <div className={cn("w-full", className)}>
        <ProductGridEmptyState {...resolvedEmptyState} />
      </div>
    );
  }

  return (
    <ul
      role="list"
      aria-label={`${products.length} products`}
      className={cn(
        "grid w-full list-none grid-cols-1 gap-6 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

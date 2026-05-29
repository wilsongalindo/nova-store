"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { InventoryStatus, Product, ProductVariant } from "@/types";

import { AddToCartButton } from "./add-to-cart-button";
import { ProductGallery } from "./product-gallery";

export interface ProductDetailProps {
  product: Product;
  className?: string;
  onAddToCart?: (payload: {
    product: Product;
    variant: ProductVariant | null;
    price: number;
  }) => void;
}

const INVENTORY_LABELS: Record<InventoryStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

const INVENTORY_STYLES: Record<InventoryStatus, string> = {
  in_stock:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  low_stock:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300",
  out_of_stock:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-300",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getPromotionBadgeVariant(
  badge: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (badge) {
    case "Sale":
      return "destructive";
    case "Best Seller":
      return "secondary";
    default:
      return "default";
  }
}

interface ProductRatingProps {
  rating: Product["rating"];
  reviewCount: Product["reviewCount"];
}

function ProductRating({ rating, reviewCount }: ProductRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`${rating} out of 5 stars, ${reviewCount.toLocaleString()} reviews`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFilled = roundedRating >= starValue;
          const isHalf =
            !isFilled && roundedRating >= starValue - 0.5 && roundedRating < starValue;

          return (
            <Star
              key={starValue}
              className={cn(
                "size-5 shrink-0",
                isFilled || isHalf
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted/40 text-muted-foreground/40",
                isHalf && "opacity-60",
              )}
            />
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground tabular-nums">
        {rating.toFixed(1)} ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
}

function resolveInitialVariant(product: Product): ProductVariant | null {
  if (product.variants.length === 0) {
    return null;
  }

  const availableVariant = product.variants.find((variant) => variant.stock > 0);

  return availableVariant ?? product.variants[0];
}

export function ProductDetail({
  product,
  className,
  onAddToCart,
}: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => resolveInitialVariant(product),
  );

  const displayPrice = selectedVariant?.price ?? product.price;
  const variantOutOfStock = selectedVariant !== null && selectedVariant.stock === 0;
  const isAddToCartDisabled =
    product.inventoryStatus === "out_of_stock" || variantOutOfStock;

  const variantSelectId = useMemo(
    () => `variant-select-${product.id}`,
    [product.id],
  );

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          productName={product.name}
          promotionBadge={product.promotionBadge}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.category}</Badge>
            {product.promotionBadge ? (
              <Badge variant={getPromotionBadgeVariant(product.promotionBadge)}>
                {product.promotionBadge}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className={cn("font-medium", INVENTORY_STYLES[product.inventoryStatus])}
            >
              {INVENTORY_LABELS[product.inventoryStatus]}
            </Badge>
          </div>

          <header className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <ProductRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </header>

          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatPrice(displayPrice)}
          </p>

          {product.variants.length > 0 ? (
            <div className="space-y-2">
              <label htmlFor={variantSelectId} className="text-sm font-medium">
                Variant
              </label>
              <Select
                value={selectedVariant?.id}
                onValueChange={(value) => {
                  const variant = product.variants.find((item) => item.id === value);
                  setSelectedVariant(variant ?? null);
                }}
              >
                <SelectTrigger id={variantSelectId} className="w-full sm:w-80">
                  <SelectValue placeholder="Select a variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.label} — {formatPrice(variant.price)}
                      {variant.stock === 0 ? " (Out of stock)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVariant ? (
                <p className="text-sm text-muted-foreground">
                  SKU: {selectedVariant.sku}
                  {selectedVariant.stock > 0
                    ? ` · ${selectedVariant.stock} in stock`
                    : " · Out of stock"}
                </p>
              ) : null}
            </div>
          ) : null}

          <Separator />

          <section aria-labelledby={`description-${product.id}`}>
            <h2
              id={`description-${product.id}`}
              className="mb-3 text-lg font-semibold tracking-tight"
            >
              Description
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </section>

          <AddToCartButton
            product={product}
            variant={selectedVariant}
            price={displayPrice}
            disabled={isAddToCartDisabled}
            className="w-full sm:w-auto"
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </article>
  );
}

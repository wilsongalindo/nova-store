"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildAddToCartPayload,
  useCartStore,
  type AddToCartPayload,
} from "@/features/cart/cart-store";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import type { InventoryStatus, Product } from "@/types";

export interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (payload: AddToCartPayload) => void;
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
                "size-4 shrink-0",
                isFilled || isHalf
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted/40 text-muted-foreground/40",
                isHalf && "opacity-60",
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        ({reviewCount.toLocaleString()})
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  className,
  onAddToCart,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.inventoryStatus === "out_of_stock";
  const primaryImage = product.images[0];

  const handleAddToCart = () => {
    const payload = buildAddToCartPayload(product);

    if (onAddToCart) {
      onAddToCart(payload);
      return;
    }

    addItem(payload.product, payload.variant, 1);
  };

  return (
    <Card
      className={cn(
        "group h-full gap-0 py-0 transition-shadow hover:shadow-md focus-within:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.promotionBadge ? (
          <Badge
            variant={getPromotionBadgeVariant(product.promotionBadge)}
            className="absolute top-3 left-3 z-10"
          >
            {product.promotionBadge}
          </Badge>
        ) : null}

        <Link
          href={`/products/${product.slug}`}
          className="block size-full rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`View details for ${product.name}`}
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex size-full items-center justify-center text-sm text-muted-foreground"
              aria-hidden="true"
            >
              No image
            </div>
          )}
        </Link>
      </div>

      <CardHeader className="gap-2 px-4 pt-4 pb-2">
        <Badge variant="outline" className="w-fit font-normal">
          {product.category}
        </Badge>
        <CardTitle className="line-clamp-2 text-base leading-snug">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <ProductRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
          <p className="text-lg font-semibold tabular-nums tracking-tight">
            {formatPrice(product.price)}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              INVENTORY_STYLES[product.inventoryStatus],
            )}
          >
            {INVENTORY_LABELS[product.inventoryStatus]}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-1 gap-2 border-t px-4 py-4 sm:grid-cols-2">
        <Button variant="outline" asChild className="w-full">
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
        <Button
          type="button"
          className="w-full"
          disabled={isOutOfStock}
          aria-label={
            isOutOfStock
              ? `${product.name} is out of stock`
              : `Add ${product.name} to cart`
          }
          onClick={handleAddToCart}
        >
          <ShoppingCart aria-hidden="true" />
          Add To Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

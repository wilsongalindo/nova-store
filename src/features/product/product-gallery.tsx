"use client";

import { useState } from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: string[];
  productName: string;
  promotionBadge?: string;
  className?: string;
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

export function ProductGallery({
  images,
  productName,
  promotionBadge,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(selectedIndex, Math.max(images.length - 1, 0));
  const selectedImage = images[safeIndex];

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground",
          className,
        )}
        role="img"
        aria-label={`No images available for ${productName}`}
      >
        No image available
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {promotionBadge ? (
          <Badge
            variant={getPromotionBadgeVariant(promotionBadge)}
            className="absolute top-4 left-4 z-10"
          >
            {promotionBadge}
          </Badge>
        ) : null}

        <Image
          src={selectedImage}
          alt={`${productName} — image ${safeIndex + 1} of ${images.length}`}
          fill
          priority={safeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <ul
          className="flex list-none gap-3 overflow-x-auto p-0 m-0"
          aria-label={`${productName} image thumbnails`}
        >
          {images.map((image, index) => {
            const isSelected = index === safeIndex;

            return (
              <li key={`${image}-${index}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-current={isSelected ? "true" : undefined}
                  className={cn(
                    "relative size-20 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/30",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

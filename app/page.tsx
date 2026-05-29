import { Suspense } from "react";

import { CatalogView } from "@/features/catalog/catalog-view";
import { getCatalogPriceBounds } from "@/features/catalog/filter-params";
import { getCategories, getProducts } from "@/lib/products";

function CatalogFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="mb-8 h-48 animate-pulse rounded-xl bg-muted"
        aria-hidden="true"
      />
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const products = getProducts();
  const categories = getCategories();
  const priceBounds = getCatalogPriceBounds(products);

  return (
    <main>
      <Suspense fallback={<CatalogFallback />}>
        <CatalogView
          products={products}
          categories={categories}
          priceBounds={priceBounds}
        />
      </Suspense>
    </main>
  );
}

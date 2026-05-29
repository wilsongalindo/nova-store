import { Suspense } from "react";

import { CatalogView } from "@/features/catalog/catalog-view";
import { getCatalogPriceBounds } from "@/features/catalog/filter-params";
import { getCategories, getProducts } from "@/lib/products";

function CatalogLoadingFallback() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading catalog"
      className="space-y-8"
    >
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="mb-4 h-5 w-20 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="h-10 animate-pulse rounded bg-muted md:col-span-2 lg:col-span-4" />
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted md:col-span-2 lg:col-span-4" />
        </div>
      </div>
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="aspect-[4/5] animate-pulse rounded-xl bg-muted"
          />
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
    <main
      id="main-content"
      className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
    >
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          Shop All Products
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Discover our curated catalog across electronics, fashion, home, sports,
          and beauty.
        </p>
      </header>

      <Suspense fallback={<CatalogLoadingFallback />}>
        <CatalogView
          products={products}
          categories={categories}
          priceBounds={priceBounds}
        />
      </Suspense>
    </main>
  );
}

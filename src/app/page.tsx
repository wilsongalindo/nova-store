import { Suspense } from "react";

import { CatalogView } from "@/features/catalog/catalog-view";
import { getCatalogPriceBounds } from "@/features/catalog/filter-params";
import { getCategories, getProducts } from "@/lib/products";

export default function CatalogPage() {
  const products = getProducts();
  const categories = getCategories();
  const priceBounds = getCatalogPriceBounds(products);

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
    >
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Shop All Products
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Discover our curated catalog across electronics, fashion, home, sports,
          and beauty.
        </p>
      </header>

      <Suspense fallback={null}>
        <CatalogView
          products={products}
          categories={categories}
          priceBounds={priceBounds}
        />
      </Suspense>
    </main>
  );
}

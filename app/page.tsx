import { FilterBar } from "@/features/catalog/filter-bar";
import { ProductGrid } from "@/features/catalog/product-grid";
import { getProducts } from "@/lib/products";

export default function CatalogPage() {
  const products = getProducts();

  return (
    <main>
      <FilterBar />
      <ProductGrid products={products} />
    </main>
  );
}

import { notFound } from "next/navigation";

import { ProductGrid } from "@/features/catalog/product-grid";
import { ProductDetail } from "@/features/product/product-detail";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <main id="main-content" className="flex-1">
      <ProductDetail key={product.id} product={product} />

      {relatedProducts.length > 0 ? (
        <section
          aria-labelledby="related-products-heading"
          className="mx-auto w-full max-w-7xl border-t px-4 pb-12 pt-12 sm:px-6 lg:px-8"
        >
          <h2
            id="related-products-heading"
            className="mb-8 text-2xl font-semibold tracking-tight"
          >
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      ) : null}
    </main>
  );
}

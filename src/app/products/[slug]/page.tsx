import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/features/catalog/product-grid";
import { ProductDetail } from "@/features/product/product-detail";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const PRODUCT_NOT_FOUND_METADATA: Metadata = {
  title: "Product not found",
  description:
    "This product may have been removed, is temporarily unavailable, or the link you followed is incorrect.",
  openGraph: {
    title: "Product not found",
    description:
      "This product may have been removed, is temporarily unavailable, or the link you followed is incorrect.",
    type: "website",
  },
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return PRODUCT_NOT_FOUND_METADATA;
  }

  const primaryImage = product.images[0];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/products/${product.slug}`,
      type: "website",
      ...(primaryImage
        ? {
            images: [
              {
                url: primaryImage,
                alt: product.name,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <main id="main-content" className="min-w-0 flex-1">
      <ProductDetail key={product.id} product={product} />

      {relatedProducts.length > 0 ? (
        <section
          aria-labelledby="related-products-heading"
          className="mx-auto w-full min-w-0 max-w-7xl border-t px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8"
        >
          <h2
            id="related-products-heading"
            className="mb-6 text-xl font-semibold tracking-tight sm:mb-8 sm:text-2xl"
          >
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      ) : null}
    </main>
  );
}

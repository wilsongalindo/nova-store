export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  inventoryStatus: InventoryStatus;
  promotionBadge?: string;
  variants?: ProductVariant[];
}

export type SortOption = "price_asc" | "price_desc" | "rating" | "name";

export interface FilterState {
  q: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sort: SortOption;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

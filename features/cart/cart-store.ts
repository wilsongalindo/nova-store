import { create } from "zustand";

import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
}

export const useCartStore = create<CartState>(() => ({
  items: [],
}));

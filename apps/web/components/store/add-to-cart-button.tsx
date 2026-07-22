// apps/web/components/store/add-to-cart-button.tsx
"use client";

import { useCart, type CartItem } from "@/lib/cart-context";

export function AddToCartButton({ product }: { product: Omit<CartItem, "quantity"> }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      className="rounded-full bg-text px-7 py-3 font-display text-sm font-medium text-bg hover:opacity-90"
    >
      Agregar al carrito
    </button>
  );
}

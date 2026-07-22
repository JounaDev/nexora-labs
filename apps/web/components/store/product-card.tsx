// apps/web/components/store/product-card.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group glass scan overflow-hidden rounded-2xl">
      <Link href={`/tienda/${product.slug}`}>
        <div className="aspect-square bg-surface/8">
          {product.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/tienda/${product.slug}`}>
          <h3 className="mb-1 font-display font-bold">{product.name}</h3>
        </Link>
        <p className="mb-3 font-mono text-sm text-cyan">{currency.format(product.price)}</p>
        <button
          onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.images[0] })}
          className="w-full rounded-full bg-surface/8 py-2 text-xs text-text-muted hover:bg-cyan/15 hover:text-cyan"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

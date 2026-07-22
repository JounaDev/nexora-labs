// apps/web/app/tienda/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@nexora/database/client";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
export default async function ProductoPage({ params }) {
    const product = await prisma.product.findUnique({ where: { slug: params.slug } });
    if (!product || !product.isActive)
        notFound();
    return (<section className="mx-auto grid max-w-4xl gap-10 px-6 py-16 sm:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-2xl bg-surface/8">
        {product.images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover"/>)}
      </div>

      <div>
        <p className="mb-2 font-mono text-xs text-cyan">{product.category}</p>
        <h1 className="mb-3 font-display text-2xl font-black">{product.name}</h1>
        <p className="mb-6 font-mono text-xl text-cyan">{currency.format(Number(product.price))}</p>
        <p className="mb-8 text-sm leading-relaxed text-text-muted">{product.description}</p>

        {product.stock > 0 ? (<AddToCartButton
  product={{
    productId: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.images[0],
  }}
/>) : (<p className="text-sm text-danger">Sin stock por ahora.</p>)}
      </div>
    </section>);
}

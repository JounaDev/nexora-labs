// apps/web/app/tienda/page.tsx
import { prisma } from "@nexora/database/client";
import { ProductCard } from "@/components/store/product-card";

export default async function TiendaPage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-2 font-mono text-xs tracking-widest text-cyan">TIENDA</p>
      <h1 className="mb-10 font-display text-3xl font-black">Hardware verificado por el mismo equipo que lo repara.</h1>

      {products.length === 0 ? (
        <p className="text-text-muted">Todavía no hay productos publicados.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), images: p.images }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

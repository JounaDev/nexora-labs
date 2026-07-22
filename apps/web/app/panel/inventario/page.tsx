// apps/web/app/panel/inventario/page.tsx
import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";
import { StockControls } from "@/components/dashboard/stock-controls";

export default async function InventarioPage() {
  const items = await prisma.inventoryItem.findMany({ orderBy: { name: "asc" } });
  const lowStock = items.filter((i) => i.quantity <= i.minStock);

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Inventario</h1>
      <p className="mb-6 text-sm text-text-muted">{items.length} ítems · {lowStock.length} en stock bajo</p>

      {lowStock.length > 0 && (
        <GlassCard className="mb-6 !border-warning/25 !bg-warning/5">
          <h3 className="mb-2 font-display text-sm font-bold text-warning">Stock bajo</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((i) => (
              <span key={i.id} className="rounded-full bg-warning/15 px-3 py-1 font-mono text-xs text-warning">
                {i.name} — {i.quantity} und.
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard scan={false} className="!p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/10 text-left font-mono text-[0.65rem] tracking-wide text-text-muted">
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">NOMBRE</th>
              <th className="px-5 py-3">CATEGORÍA</th>
              <th className="px-5 py-3">STOCK</th>
              <th className="px-5 py-3">PRECIO</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/5">
                <td className="px-5 py-3 font-mono text-text-muted">{item.sku}</td>
                <td className="px-5 py-3">{item.name}</td>
                <td className="px-5 py-3 text-text-muted">{item.category}</td>
                <td className="px-5 py-3">
                  <span className={item.quantity <= item.minStock ? "text-warning" : ""}>{item.quantity}</span>
                </td>
                <td className="px-5 py-3 font-mono text-text-muted">
                  ${Number(item.unitPrice).toLocaleString("es-CO")}
                </td>
                <td className="px-5 py-3">
                  <StockControls itemId={item.id} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-muted">
                  Aún no hay ítems en inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}

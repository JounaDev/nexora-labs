// apps/web/app/panel/reportes/page.tsx
import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

async function getMonthlyRevenue() {
  const months: { label: string; total: number }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paidAt: { gte: start, lt: end } },
    });
    months.push({ label: start.toLocaleDateString("es-CO", { month: "short" }), total: Number(result._sum.amount ?? 0) });
  }
  return months;
}

export default async function ReportesPage() {
  const [revenue, byStatus, byCategory] = await Promise.all([
    getMonthlyRevenue(),
    prisma.repairTicket.groupBy({ by: ["status"], _count: true }),
    prisma.repairTicket.groupBy({ by: ["category"], _count: true }),
  ]);

  const maxRevenue = Math.max(...revenue.map((r) => r.total), 1);

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Reportes</h1>
      <p className="mb-6 text-sm text-text-muted">Últimos 6 meses</p>

      <GlassCard className="mb-6">
        <h3 className="mb-4 font-display text-sm font-bold">Ingresos por mes</h3>
        <div className="flex h-40 items-end gap-4">
          {revenue.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-gradient-to-t from-blue to-cyan"
                style={{ height: `${Math.max((m.total / maxRevenue) * 100, 3)}%` }}
                title={currency.format(m.total)}
              />
              <span className="font-mono text-[0.65rem] text-text-muted">{m.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 font-display text-sm font-bold">Tickets por estado</h3>
          <div className="flex flex-col gap-2">
            {byStatus.map((s) => (
              <div key={s.status} className="flex justify-between text-sm">
                <span className="text-text-muted">{s.status}</span>
                <span className="font-mono">{s._count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 font-display text-sm font-bold">Tickets por categoría</h3>
          <div className="flex flex-col gap-2">
            {byCategory.map((c) => (
              <div key={c.category} className="flex justify-between text-sm">
                <span className="text-text-muted">{c.category}</span>
                <span className="font-mono">{c._count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}

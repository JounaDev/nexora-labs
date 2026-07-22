// apps/web/app/panel/facturacion/page.tsx
import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";
import { GenerateInvoiceButton, MarkPaidButton } from "@/components/dashboard/invoice-actions";
import { TriangleAlert } from "lucide-react";
const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "text-text-muted bg-surface/8", ISSUED: "text-cyan bg-cyan/15", PAID: "text-success bg-success/15",
  OVERDUE: "text-warning bg-warning/15", CANCELLED: "text-danger bg-danger/15",
};

export default async function FacturacionPage() {
  const [pendingTickets, invoices] = await Promise.all([
    prisma.repairTicket.findMany({
      where: { status: { in: ["COMPLETED", "DELIVERED"] }, invoice: null },
      include: { client: { include: { user: true } } },
      orderBy: { completedAt: "desc" },
    }),
    prisma.invoice.findMany({
      include: { client: { include: { user: true } }, ticket: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const issuedInvoices = invoices.filter((invoice) => invoice.status === "ISSUED");

  const pendingInvoicesCount = issuedInvoices.length;

  const pendingAmount = issuedInvoices.reduce(
    (total, invoice) => total + Number(invoice.total),
    0
  );
  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Facturación</h1>
      <p className="mb-6 text-sm text-text-muted">{invoices.length} facturas emitidas</p>
      {pendingInvoicesCount > 0 && (
        <GlassCard className="mb-6 border border-warning/25 bg-warning/10">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15">
                <TriangleAlert className="h-6 w-6 text-warning" />
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-warning">
                  Facturas pendientes de pago
                </h3>

                <p className="text-sm text-text-muted">
                  Hay{" "}
                  <span className="font-semibold text-white">
                    {pendingInvoicesCount}
                  </span>{" "}
                  factura{pendingInvoicesCount !== 1 && "s"} emitida
                  {pendingInvoicesCount !== 1 && "s"} por un valor total de{" "}
                  <span className="font-semibold text-warning">
                    {currency.format(pendingAmount)}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
      {pendingTickets.length > 0 && (
        <GlassCard className="mb-6 !border-warning/25 !bg-warning/5">
          <h3 className="mb-3 font-display text-sm font-bold text-warning">Tickets finalizados sin factura</h3>
          <div className="flex flex-col gap-2">
            {pendingTickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span>
                  <span className="font-mono text-text-muted">{t.code}</span> — {t.client.user.name}
                </span>
                <GenerateInvoiceButton ticketId={t.id} />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard scan={false} className="!p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/10 text-left font-mono text-[0.65rem] tracking-wide text-text-muted">
              <th className="px-5 py-3">FACTURA</th>
              <th className="px-5 py-3">TICKET</th>
              <th className="px-5 py-3">CLIENTE</th>
              <th className="px-5 py-3">TOTAL</th>
              <th className="px-5 py-3">ESTADO</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border/5">
                <td className="px-5 py-3 font-mono text-text-muted">{inv.number}</td>
                <td className="px-5 py-3 font-mono text-text-muted">{inv.ticket?.code ?? "—"}</td>
                <td className="px-5 py-3">{inv.client.user.name}</td>
                <td className="px-5 py-3 font-mono">{currency.format(Number(inv.total))}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 font-mono text-xs ${STATUS_COLOR[inv.status]}`}>{inv.status}</span>
                </td>
                <td className="px-5 py-3">{inv.status === "ISSUED" && <MarkPaidButton invoiceId={inv.id} />}</td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-muted">Aún no hay facturas emitidas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}

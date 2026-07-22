// apps/web/app/mi-cuenta/reparaciones/[id]/page.tsx
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@nexora/database/client";
import { GlassCard, StatusBadge } from "@nexora/ui/components";
import { RepairTimeline } from "@/components/portal/repair-timeline";
import { WompiPayCard } from "@/components/shared/wompi-pay-card";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function ReparacionDetallePage({ params }: { params: { id: string } }) {
  const session = await auth();
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId: session!.user.id } });
  if (!clientProfile) notFound();

  // Filtro por clientId en la misma query — evita que un cliente vea
  // el ticket de otro cambiando el id en la URL. Un admin inspeccionando
  // pasaría por una ruta distinta con permisos propios (fuera de alcance aquí).
  const ticket = await prisma.repairTicket.findFirst({
    where: { id: params.id, clientId: clientProfile.id },
    include: {
      device: true,
      warranty: true,
      invoice: { include: { payments: true } },
      attachments: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!ticket) notFound();

  return (
    <>
      <p className="font-mono text-xs text-cyan">{ticket.trackingCode}</p>
      <h1 className="mb-8 font-display text-2xl font-black">
        {ticket.device.brand} {ticket.device.model ?? ""}
      </h1>

      <GlassCard className="mb-6">
        <h3 className="mb-2 font-display text-sm font-bold">Estado</h3>
        {["CANCELLED", "DELIVERED"].includes(ticket.status) ? (
          <StatusBadge status={ticket.status} />
        ) : (
          <RepairTimeline status={ticket.status} />
        )}
      </GlassCard>

    <WompiPayCard
  ticketId={ticket.id}
  trackingCode={ticket.trackingCode}
  status={ticket.status}
  paymentStatus={ticket.paymentStatus}
  returnPath={`/mi-cuenta/reparaciones/${ticket.id}`}
/>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 font-display text-sm font-bold">Garantía</h3>
          {ticket.warranty ? (
            <p className="text-sm text-text-muted">
              Válida hasta <span className="text-text">{ticket.warranty.endDate.toLocaleDateString("es-CO")}</span>
              {ticket.warranty.isActive ? " · Activa" : " · Vencida"}
            </p>
          ) : (
            <p className="text-sm text-text-muted">Se activa al finalizar la reparación.</p>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 font-display text-sm font-bold">Factura</h3>
          {ticket.invoice ? (
            <p className="text-sm text-text-muted">
              {ticket.invoice.number} · <span className="text-text">{currency.format(Number(ticket.invoice.total))}</span> · {ticket.invoice.status}
            </p>
          ) : (
            <p className="text-sm text-text-muted">Aún no se ha generado.</p>
          )}
        </GlassCard>
      </div>

      {ticket.attachments.length > 0 && (
        <GlassCard className="mb-6">
          <h3 className="mb-3 font-display text-sm font-bold">Fotos</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {ticket.attachments.map((att) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={att.id} src={att.url} alt="" className="aspect-square rounded-lg object-cover" />
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <h3 className="mb-3 font-display text-sm font-bold">Historial</h3>
        <div className="flex flex-col gap-3">
          {ticket.statusHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{entry.note ?? entry.status}</span>
              <span className="font-mono text-xs text-text-muted">
                {entry.createdAt.toLocaleDateString("es-CO")}
              </span>
            </div>
          ))}
          {ticket.statusHistory.length === 0 && (
            <p className="text-sm text-text-muted">Sin movimientos registrados todavía.</p>
          )}
        </div>
      </GlassCard>

      <p className="mt-6 text-center text-xs text-text-muted">
        El chat en vivo con tu técnico llega en la Fase 8 (Reservas, chat e IA).
      </p>
    </>
  );
}

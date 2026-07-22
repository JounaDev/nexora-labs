// apps/web/app/panel/reparaciones/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@nexora/database/client";
import { GlassCard, StatusBadge } from "@nexora/ui/components";
import { RepairTimeline } from "@/components/portal/repair-timeline";
import { StatusChanger } from "@/components/dashboard/status-changer";
import { WompiPayCard } from "@/components/shared/wompi-pay-card";
import { RepairCostCard } from "@/components/dashboard/repair-cost-card";
import { AssignTechnicianCard } from "@/components/dashboard/assign-technician-card";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketDetallePage({ params }: Props) {
  const { id } = await params;

  const ticket = await prisma.repairTicket.findUnique({
    where: { id },
    include: {
      client: { include: { user: true } },
      device: true,
      technician: { include: { user: true } },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        include: { changedBy: true },
      },
      parts: {
        include: { inventoryItem: true },
      },
    },
  });
  const technicians = await prisma.technicianProfile.findMany({
    include: {
      user: true,
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  console.log(
    technicians.map((t) => ({
      id: t.id,
      nombre: t.user.name,
    }))
  );

  if (!ticket) notFound();
  console.log("ticket.technicianId:", ticket.technicianId);

  console.log(
    technicians.map((t) => ({
      technicianProfileId: t.id,
      userId: t.userId,
      nombre: t.user.name,
    }))
  );

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        {/* Información del ticket */}
        <div>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs text-cyan">
                {ticket.code}
              </p>

              
              <h1 className="mb-1 font-display text-2xl font-black">
                {ticket.device.brand} {ticket.device.model ?? ""}
              </h1>

              <p className="text-sm text-text-muted">
                {ticket.client.user.name} ·{" "}
                {ticket.client.user.phone ?? "sin teléfono"}
              </p>
              <p className="font-mono text-xs text-gold">
             Tacking ID:   {ticket.trackingCode}
              </p>
            </div>




          </div>
        
        </div>



        <div className="flex w-full flex-col gap-4 lg:w-80">
          <AssignTechnicianCard
            ticketId={ticket.id}
            currentTechnicianId={ticket.technicianId}
            technicians={technicians}
          />

          <RepairCostCard
            ticketId={ticket.id}
            laborCost={ticket.laborCost ? Number(ticket.laborCost) : null}
            partsCost={ticket.partsCost ? Number(ticket.partsCost) : null}
            discount={ticket.discount ? Number(ticket.discount) : null}
            tax={ticket.tax ? Number(ticket.tax) : null}
            finalCost={ticket.finalCost ? Number(ticket.finalCost) : null}
            status={ticket.status}
          />
        </div>
  
      </div>
      

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <GlassCard>
          <h3 className="mb-2 font-display text-sm font-bold">
            Estado actual
          </h3>

          {["CANCELLED", "DELIVERED"].includes(ticket.status) ? (
            <StatusBadge status={ticket.status} />
          ) : (
            <RepairTimeline status={ticket.status} />
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 font-display text-sm font-bold">
            Cambiar estado
          </h3>

          <StatusChanger
            ticketId={ticket.id}
            currentStatus={ticket.status}
          />
        </GlassCard>
      </div>

<WompiPayCard
  ticketId={ticket.id}
  trackingCode={ticket.trackingCode}
  status={ticket.status}
  paymentStatus={ticket.paymentStatus}
  returnPath={`/panel/reparaciones/${ticket.id}`}
/>
      {ticket.problemDescription && (
        <GlassCard className="mb-6">
          <h3 className="mb-2 font-display text-sm font-bold">
            Problema reportado
          </h3>

          <p className="text-sm text-text-muted">
            {ticket.problemDescription}
          </p>

          {ticket.diagnosis && (
            <>
              <h3 className="mb-2 mt-4 font-display text-sm font-bold">
                Diagnóstico técnico
              </h3>

              <p className="text-sm text-text-muted">
                {ticket.diagnosis}
              </p>
            </>
          )}
        </GlassCard>
      )}

      {ticket.parts.length > 0 && (
        <GlassCard className="mb-6">
          <h3 className="mb-3 font-display text-sm font-bold">
            Repuestos usados
          </h3>

          <div className="flex flex-col gap-2 text-sm">
            {ticket.parts.map((p) => (
              <div
                key={p.id}
                className="flex justify-between text-text-muted"
              >
                <span>
                  {p.quantity}× {p.inventoryItem.name}
                </span>

                <span className="font-mono">
                  ${Number(p.unitPrice).toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <h3 className="mb-3 font-display text-sm font-bold">
          Historial de cambios
        </h3>

        <div className="flex flex-col gap-3">
          {ticket.statusHistory.map((entry) => (
            <div
              key={entry.id}
              className="border-b border-border/5 pb-3 text-sm last:border-0 last:pb-0"
            >
              <div className="flex justify-between">
                <StatusBadge status={entry.status} />

                <span className="font-mono text-xs text-text-muted">
                  {entry.createdAt.toLocaleString("es-CO")}
                </span>
              </div>

              {entry.note && (
                <p className="mt-1 text-text-muted">{entry.note}</p>
              )}

              <p className="mt-1 font-mono text-[0.68rem] text-text-muted">
                por {entry.changedBy.name}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
}
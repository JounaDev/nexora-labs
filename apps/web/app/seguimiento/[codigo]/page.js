import { notFound } from "next/navigation";
import { prisma } from "@nexora/database/client";
export default async function SeguimientoTicketPage({ params }) {
    const { codigo } = await params;
    const ticket = await prisma.repairTicket.findUnique({
        where: {
            code: codigo,
        },
        include: {
            client: {
                include: {
                    user: true,
                },
            },
            device: true,
            technician: {
                include: {
                    user: true,
                },
            },
            warranty: true,
            statusHistory: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    if (!ticket) {
        notFound();
    }
    return (<main className="mx-auto max-w-5xl p-8">
    <h1 className="mb-8 font-display text-4xl font-black">
      Seguimiento de reparación
    </h1>

    <div className="rounded-2xl border border-border/10 bg-surface/5 p-8">

      <div className="mb-6">
        <p className="text-xs text-text-muted">Código</p>
        <h2 className="font-mono text-2xl font-bold">
          {ticket.code}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <p className="text-xs text-text-muted">Cliente</p>
          <p className="text-lg">
            {ticket.client.user.name}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Estado</p>
          <p className="text-lg font-semibold">
            {ticket.status}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Dispositivo</p>
          <p className="text-lg">
            {ticket.device.brand} {ticket.device.model}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Técnico</p>
          <p className="text-lg">
            {ticket.technician?.user.name ?? "Sin asignar"}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Fecha de ingreso</p>
          <p className="text-lg">
            {ticket.createdAt.toLocaleDateString("es-CO")}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Garantía</p>
          <p className="text-lg">
            {ticket.warranty
            ? ticket.warranty.endDate.toLocaleDateString("es-CO")
            : "No disponible"}
          </p>
        </div>

      </div>

      <div className="mt-8">
        <p className="mb-2 text-xs text-text-muted">
          Problema reportado
        </p>

        <div className="rounded-xl bg-surface/5 p-4">
          {ticket.problemDescription}
        </div>
      </div>
      <div className="mt-10">
  <h3 className="mb-4 text-xl font-bold">
    Historial del ticket
  </h3>

  <div className="space-y-4">
    {ticket.statusHistory.map((item) => (<div key={item.id} className="rounded-xl border border-border/10 bg-surface/5 p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {item.status}
          </span>

          <span className="text-sm text-text-muted">
            {item.createdAt.toLocaleString("es-CO")}
          </span>
        </div>

        {item.note && (<p className="mt-2 text-sm text-text-muted">
            {item.note}
          </p>)}
      </div>))}
  </div>
    </div>

    </div>
  </main>);
}

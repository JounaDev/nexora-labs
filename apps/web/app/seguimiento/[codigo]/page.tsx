import { notFound } from "next/navigation";
import { prisma } from "@nexora/database/client";

interface Props {
  params: Promise<{
    codigo: string;
  }>;
}

export default async function SeguimientoTicketPage({ params }: Props) {
  const { codigo } = await params;

  const ticket = await prisma.repairTicket.findUnique({
    where: {
      trackingCode: codigo,
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

  invoice: true,

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

 return (
  <main className="mx-auto max-w-5xl p-8">
    <h1 className="mb-8 font-display text-4xl font-black">
      Seguimiento de reparación
    </h1>

    <div className="rounded-2xl border border-border/10 bg-surface/5 p-8">

      <div className="mb-6">
        <p className="text-xs text-text-muted">Código</p>
        <h2 className="font-mono text-2xl font-bold">
          {ticket.trackingCode}
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
    Historial de{ticket.invoice && (
  <div className="mt-10 rounded-2xl border border-border/10 bg-surface/5 p-6">

    <h3 className="mb-6 text-xl font-bold">
      Resumen de la reparación
    </h3>

    <div className="space-y-4">

      <div className="flex justify-between">
        <span className="text-text-muted">
          Mano de obra
        </span>

        <span>
          ${Number(ticket.laborCost ?? 0).toLocaleString("es-CO")}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-text-muted">
          Repuestos
        </span>

        <span>
          ${Number(ticket.partsCost ?? 0).toLocaleString("es-CO")}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-text-muted">
          Impuestos
        </span>

        <span>
          ${Number(ticket.tax ?? 0).toLocaleString("es-CO")}
        </span>
      </div>

      <div className="flex justify-between text-red-400">
        <span>
          Descuento
        </span>

        <span>
          -${Number(ticket.discount ?? 0).toLocaleString("es-CO")}
        </span>
      </div>

      <div className="border-t border-border/10 pt-4 flex justify-between text-xl font-black">
        <span>Total</span>

        <span>
          ${Number(ticket.finalCost ?? 0).toLocaleString("es-CO")}
        </span>
      </div>

      <div className="border-t border-border/10 pt-4 text-sm text-text-muted">

        <div className="flex justify-between">
          <span>Factura</span>

          <span>{ticket.invoice.number}</span>
        </div>

        <div className="mt-2 flex justify-between">
          <span>Estado</span>

          <span>{ticket.invoice.status}</span>
        </div>

      </div>

      {ticket.invoice.status !== "PAID" && (
        <a
          href={`/seguimiento/${ticket.trackingCode}/pago`}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Pagar con Wompi
        </a>
      )}

    </div>

  </div>
)}l ticket
  </h3>
{ticket.invoice && ticket.invoice.status !== "PAID" && (
  <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
    <h3 className="text-xl font-bold">
      Pago pendiente
    </h3>

    <p className="mt-2 text-text-muted">
      Tu reparación ya tiene una factura generada.
    </p>

    <div className="mt-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-text-muted">
          Total
        </p>

       <p className="text-3xl font-black">
  $
  {Number(ticket.finalCost ?? ticket.invoice.total).toLocaleString("es-CO")}
</p>
      </div>

      <a
        href={`/seguimiento/${ticket.trackingCode}/pago`}
        className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Pagar con Wompi
      </a>
    </div>
  </div>
)}
  <div className="space-y-4">
    {ticket.statusHistory.map((item) => (
      <div
        key={item.id}
        className="rounded-xl border border-border/10 bg-surface/5 p-4"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {item.status}
          </span>

          <span className="text-sm text-text-muted">
            {item.createdAt.toLocaleString("es-CO")}
          </span>
        </div>

        {item.note && (
          <p className="mt-2 text-sm text-text-muted">
            {item.note}
          </p>
        )}
      </div>
    ))}
  </div>
</div>

    </div>
  </main>
);
}
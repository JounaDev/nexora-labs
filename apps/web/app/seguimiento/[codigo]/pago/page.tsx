import { notFound } from "next/navigation";
import { prisma } from "@nexora/database/client";
import { createWompiCheckout } from "@/lib/actions/payments";

interface Props {
  params: Promise<{
    codigo: string;
  }>;
}

export default async function PagoTicketPage({ params }: Props) {
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
      invoice: true,
    },
  });

  if (!ticket || !ticket.invoice) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="rounded-3xl border border-border/10 bg-surface/5 p-8 shadow-xl">

        <h1 className="text-4xl font-black">
          Pago seguro
        </h1>

        <p className="mt-2 text-text-muted">
          Revisa la información antes de continuar con el pago.
        </p>

        <div className="my-8 border-t border-border/10" />

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-xs text-text-muted">Ticket</p>
            <p className="font-mono text-xl font-bold">
              {ticket.trackingCode}
            </p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Estado</p>
            <p className="text-xl font-semibold">
              {ticket.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Cliente</p>
            <p className="text-lg">
              {ticket.client.user.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Dispositivo</p>
            <p className="text-lg">
              {ticket.device.brand} {ticket.device.model}
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

        <div className="my-8 border-t border-border/10" />

        {/* Factura */}

        <div className="rounded-2xl border border-border/10 bg-surface/5 p-6">

          <h3 className="mb-6 text-xl font-bold">
            Resumen de la reparación
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-text-muted">
                Mano de obra
              </span>

              <span className="font-medium">
                ${Number(ticket.laborCost ?? 0).toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">
                Repuestos
              </span>

              <span className="font-medium">
                ${Number(ticket.partsCost ?? 0).toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">
                Descuento
              </span>

              <span className="font-medium text-red-400">
                -${Number(ticket.discount ?? 0).toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">
                Impuestos
              </span>

              <span className="font-medium">
                ${Number(ticket.tax ?? 0).toLocaleString("es-CO")}
              </span>
            </div>

            <div className="border-t border-border/10 pt-5 flex justify-between text-3xl font-black">

              <span>Total</span>

              <span className="text-primary">
                ${Number(ticket.finalCost ?? 0).toLocaleString("es-CO")}
              </span>

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <h3 className="text-lg font-bold">
            Pago seguro
          </h3>

          <p className="mt-2 text-sm text-text-muted">
            Tu información será procesada mediante Wompi utilizando una conexión segura.
          </p>

        </div>

        <form
  action={createWompiCheckout}
  className="mt-8"
>
  <input
    type="hidden"
    name="trackingCode"
    value={ticket.trackingCode}
  />

  <button
    type="submit"
    className="w-full rounded-2xl bg-primary py-4 text-lg font-bold text-white transition hover:opacity-90"
  >
    Pagar ${Number(ticket.finalCost ?? 0).toLocaleString("es-CO")}
  </button>
</form>

      </div>
    </main>
  );
}
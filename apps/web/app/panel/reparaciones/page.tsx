// apps/web/app/panel/reparaciones/page.tsx

import Link from "next/link";
import { prisma } from "@nexora/database/client";
import { GlassCard, StatusBadge, Button } from "@nexora/ui/components";

interface Props {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function ReparacionesPage({
  
  searchParams,
}: Props) {
  const { status } = await searchParams;

  const tickets = await prisma.repairTicket.findMany({
    where: status
      ? {
          status: status as never,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
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
    },
  });

  const FILTERS = [
    { label: "Todos", value: undefined },
    { label: "Recibido", value: "RECEIVED" },
    { label: "Diagnóstico", value: "DIAGNOSIS" },
    { label: "En reparación", value: "IN_REPAIR" },
    { label: "Pruebas", value: "TESTING" },
    { label: "Finalizado", value: "COMPLETED" },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black">
            Reparaciones
          </h1>

          <p className="text-sm text-text-muted">
            {tickets.length} tickets
          </p>
        </div>

        <Link href="/panel/reparaciones/nuevo">
          <Button scan>
            + Nuevo ticket
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.label}
            href={
              filter.value
                ? `/panel/reparaciones?status=${filter.value}`
                : "/panel/reparaciones"
            }
          >
            <Button
            
              variant={status === filter.value || (!status && !filter.value) ? "primary" : "glass"}
              
            >
              {filter.label}
            </Button>
          </Link>
        ))}
      </div>

      <GlassCard scan={false} className="!p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/10 text-left font-mono text-[0.65rem] tracking-wide text-text-muted">
              <th className="px-5 py-3">CÓDIGO</th>
              <th className="px-5 py-3">CODIGO CLIENTE</th>
              <th className="px-5 py-3">CLIENTE</th>
              <th className="px-5 py-3">DISPOSITIVO</th>
              <th className="px-5 py-3">TÉCNICO</th>
              <th className="px-5 py-3">ESTADO</th>
              <th className="px-5 py-3 text-right">ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-border/5 hover:bg-surface/3"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/panel/reparaciones/${ticket.id}`}
                    className="font-mono text-cyan"
                  >
                    {ticket.code}
                  </Link>
                </td>

                 <td className="px-5 py-3">
                  <Link
                    href={`/panel/reparaciones/${ticket.id}`}
                    className="font-mono text-cyan"
                  >
                    {ticket.trackingCode}
                  </Link>
                </td>

                <td className="px-5 py-3">
                  {ticket.client.user.name}
                </td>

                <td className="px-5 py-3">
                  {ticket.device.brand} {ticket.device.model ?? ""}
                </td>

                <td className="px-5 py-3 text-text-muted">
                  {ticket.technician?.user.name ?? "Sin asignar"}
                </td>

                <td className="px-5 py-3">
                  <StatusBadge status={ticket.status} />
                </td>

                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/panel/reparaciones/${ticket.id}`}
                    className="rounded-lg bg-cyan/15 px-3 py-2 text-xs font-semibold text-cyan transition hover:bg-cyan/25"
                  >
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-text-muted"
                >
                  No hay reparaciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
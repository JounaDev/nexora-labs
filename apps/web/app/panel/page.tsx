
import { prisma } from "@nexora/database/client";
import { GlassCard, StatusBadge } from "@nexora/ui/components";
import ModelViewer from "@/components/ModelViewer";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

async function getResumen() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ingresosMes, ticketsActivos, completadosMes, clientesNuevos, ticketsRecientes] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paidAt: { gte: startOfMonth } },
    }),
    prisma.repairTicket.count({
      where: { status: { notIn: ["COMPLETED", "DELIVERED", "CANCELLED"] } },
    }),
    prisma.repairTicket.count({
      where: { completedAt: { gte: startOfMonth } },
    }),
    prisma.clientProfile.count({
      where: { user: { createdAt: { gte: startOfMonth } } },
    }),
    prisma.repairTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { client: { include: { user: true } }, device: true },
    }),
  ]);

  return {
    ingresosMes: Number(ingresosMes._sum.amount ?? 0),
    ticketsActivos,
    completadosMes,
    clientesNuevos,
    ticketsRecientes,
  };
}

export default async function ResumenPage() {
  const data = await getResumen();

  return (
    <>
      <h1 className="font-display text-2xl font-black">Resumen</h1>
      <p className="mb-8 mt-1 text-sm text-text-muted">Vista general de la operación</p>

      

      <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <GlassCard>
          <p className="mb-2 font-mono text-[0.68rem] tracking-wide text-text-muted">INGRESOS DEL MES</p>
          <p className="font-display text-2xl font-black">{currency.format(data.ingresosMes)}</p>
        </GlassCard>
        <GlassCard>
          <p className="mb-2 font-mono text-[0.68rem] tracking-wide text-text-muted">TICKETS ACTIVOS</p>
          <p className="font-display text-2xl font-black">{data.ticketsActivos}</p>
        </GlassCard>
        <GlassCard>
          <p className="mb-2 font-mono text-[0.68rem] tracking-wide text-text-muted">COMPLETADOS (MES)</p>
          <p className="font-display text-2xl font-black">{data.completadosMes}</p>
        </GlassCard>
        <GlassCard>
          <p className="mb-2 font-mono text-[0.68rem] tracking-wide text-text-muted">CLIENTES NUEVOS</p>
          <p className="font-display text-2xl font-black">{data.clientesNuevos}</p>
        </GlassCard>


  
      </div>

      <GlassCard scan={false}>
        <h3 className="mb-4 font-display text-sm font-bold">Tickets recientes</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/10 text-left font-mono text-[0.65rem] tracking-wide text-text-muted">
              <th className="pb-2">CÓDIGO</th>
              <th className="pb-2">CLIENTE</th>
              <th className="pb-2">DISPOSITIVO</th>
              <th className="pb-2">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {data.ticketsRecientes.map((ticket) => (
              <tr key={ticket.id} className="border-b border-border/5">
                <td className="py-3 font-mono text-text-muted">{ticket.code}</td>
                <td className="py-3">{ticket.client.user.name}</td>
                <td className="py-3">
                  {ticket.device.brand} {ticket.device.model ?? ""}
                </td>
                <td className="py-3">
                  <StatusBadge status={ticket.status} />
                </td>
              </tr>
            ))}
            {data.ticketsRecientes.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-text-muted">
                  Aún no hay tickets registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}

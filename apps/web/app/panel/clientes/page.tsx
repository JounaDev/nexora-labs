// apps/web/app/panel/clientes/page.tsx
import Link from "next/link";
import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";

export default async function ClientesPage() {
  const clients = await prisma.clientProfile.findMany({
    include: { user: true, _count: { select: { repairTickets: true } } },
    orderBy: { user: { createdAt: "desc" } },
  });

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Clientes</h1>
      <p className="mb-6 text-sm text-text-muted">{clients.length} registrados</p>

      <GlassCard scan={false} className="!p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/10 text-left font-mono text-[0.65rem] tracking-wide text-text-muted">
              <th className="px-5 py-3">NOMBRE</th>
              <th className="px-5 py-3">CORREO</th>
              <th className="px-5 py-3">TELÉFONO</th>
              <th className="px-5 py-3">TICKETS</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-border/5">
                <td className="px-5 py-3">{c.user.name}</td>
                <td className="px-5 py-3 text-text-muted">{c.user.email}</td>
                <td className="px-5 py-3 text-text-muted">{c.user.phone ?? "—"}</td>
                <td className="px-5 py-3">
                  <Link href={`/panel/reparaciones?clientId=${c.id}`} className="font-mono text-cyan">
                    {c._count.repairTickets}
                  </Link>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-muted">
                  Aún no hay clientes. Se crean solos al reservar una cita o al crear un ticket nuevo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}

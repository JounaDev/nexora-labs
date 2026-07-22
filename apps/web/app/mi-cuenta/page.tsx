// apps/web/app/mi-cuenta/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@nexora/database/client";
import { GlassCard, StatusBadge } from "@nexora/ui/components";

export default async function MisReparacionesPage() {
  const session = await auth();
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session!.user.id },
  });

  if (!clientProfile) {
    return <p className="text-text-muted">No encontramos un perfil de cliente asociado a tu cuenta.</p>;
  }

  const tickets = await prisma.repairTicket.findMany({
    where: { clientId: clientProfile.id },
    orderBy: { createdAt: "desc" },
    include: { device: true },
  });

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Mis reparaciones</h1>
      <p className="mb-8 text-sm text-text-muted">
        {tickets.length === 0 ? "Aún no tienes reparaciones registradas." : `${tickets.length} en tu historial`}
      </p>

      <div className="flex flex-col gap-3">
        {tickets.map((ticket) => (
          <Link key={ticket.id} href={`/mi-cuenta/reparaciones/${ticket.id}`}>
            <GlassCard className="flex items-center justify-between gap-4 !p-5">
              <div>
                <p className="font-mono text-xs text-cyan">{ticket.trackingCode}</p>
                <p className="font-display font-bold">
                  {ticket.device.brand} {ticket.device.model ?? ""}
                </p>
              </div>
              <StatusBadge status={ticket.status} />
            </GlassCard>
          </Link>
        ))}
      </div>
    </>
  );
}

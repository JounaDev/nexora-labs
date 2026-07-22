// apps/web/app/panel/calendario/page.tsx
import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";
import { AppointmentActions } from "@/components/dashboard/appointment-actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmada", CANCELLED: "Cancelada", COMPLETED: "Completada", NO_SHOW: "No asistió",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-warning bg-warning/15", CONFIRMED: "text-cyan bg-cyan/15", CANCELLED: "text-danger bg-danger/15",
  COMPLETED: "text-success bg-success/15", NO_SHOW: "text-text-muted bg-surface/8",
};

export default async function CalendarioPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: { scheduledAt: { gte: today } },
    orderBy: { scheduledAt: "asc" },
    include: { client: { include: { user: true } } },
    take: 50,
  });

  const byDay: Record<string, typeof appointments> = {};

for (const a of appointments) {
  const key = a.scheduledAt.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!byDay[key]) {
    byDay[key] = [];
  }

  byDay[key].push(a);
}
  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Calendario</h1>
      <p className="mb-6 text-sm text-text-muted">{appointments.length} citas próximas</p>

      {Object.entries(byDay).map(([day, items]) => (
        <div key={day} className="mb-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-text-muted">{day}</p>
          <GlassCard scan={false} className="!p-0">
            <table className="w-full text-sm">
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="border-b border-border/5 last:border-0">
                    <td className="w-20 px-5 py-3 font-mono text-cyan">
                      {a.scheduledAt.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-3">{a.client.user.name}</td>
                    <td className="px-5 py-3 text-text-muted">{a.serviceCategory}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-3 py-1 font-mono text-xs ${STATUS_COLOR[a.status]}`}>
                        {STATUS_LABEL[a.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <AppointmentActions appointmentId={a.id} status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      ))}

      {appointments.length === 0 && (
        <GlassCard scan={false}>
          <p className="text-center text-text-muted">No hay citas próximas agendadas.</p>
        </GlassCard>
      )}
    </>
  );
}

// apps/web/app/panel/reparaciones/nuevo/page.tsx
import { GlassCard } from "@nexora/ui/components";
import { NewTicketForm } from "@/components/dashboard/new-ticket-form";

export default function NuevoTicketPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Nuevo ticket</h1>
      <p className="mb-6 text-sm text-text-muted">Se genera el código automáticamente (NL-{new Date().getFullYear()}-00001, etc.)</p>

      <GlassCard scan={false} className="max-w-xl">
        <NewTicketForm />
      </GlassCard>
    </>
  );
}

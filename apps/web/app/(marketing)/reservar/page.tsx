// apps/web/app/(marketing)/reservar/page.tsx
import { BookingWidget } from "@/components/marketing/booking-widget";

export default function ReservarPage() {
  return (
    <section className="mx-auto max-w-lg px-6 py-20 sm:px-10">
      <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan">RESERVAR</p>
      <h1 className="mb-8 font-display text-3xl font-black">Agenda tu diagnóstico</h1>
      <BookingWidget />
    </section>
  );
}

// apps/web/components/marketing/booking-widget.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { getAvailableSlotsAction, createAppointmentAction } from "@/lib/actions/appointment.actions";

const SERVICE_CATEGORIES = [
  { value: "HARDWARE_REPAIR", label: "Reparación de hardware" },
  { value: "DATA_RECOVERY", label: "Recuperación de datos" },
  { value: "SOFTWARE_DEVELOPMENT", label: "Desarrollo de software" },
  { value: "CONSULTING", label: "Consultoría" },
];

function nextDays(n: number): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function BookingWidget() {
  const [selectedDate, setSelectedDate] = useState(nextDays(7)[0]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string; whatsappUrl?: string } | null>(null);

  useEffect(() => {
    setSelectedSlot(null);
    getAvailableSlotsAction(selectedDate.toISOString()).then(setSlots);
  }, [selectedDate]);

  function handleSubmit(formData: FormData) {
    if (!selectedSlot) return;
    formData.set("scheduledAt", selectedSlot);

    startTransition(async () => {

      const res = await createAppointmentAction(formData);

      if (res.success === false) {
        setResult({
          success: false,
          message: res.error,
        });
        return;
      }

      setResult({
        success: true,
        message: "¡Cita confirmada! Revisa tu correo.",
        whatsappUrl: res.whatsappUrl,
      });
    });
  }

  if (result?.success) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="mb-4 font-display font-bold">{result.message}</p>
        <a
          href={result.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-cyan/15 px-5 py-2.5 text-sm text-cyan"
        >
          Confirmar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="glass flex flex-col gap-5 rounded-2xl p-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {nextDays(7).map((d) => (
          <button
            type="button"
            key={d.toISOString()}
            onClick={() => setSelectedDate(d)}
            className={`shrink-0 rounded-lg px-3.5 py-2 font-mono text-xs ${d.toDateString() === selectedDate.toDateString() ? "bg-cyan/15 text-cyan" : "bg-surface/6 text-text-muted"
              }`}
          >
            {d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" })}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {slots.length === 0 && <p className="text-sm text-text-muted">No hay horarios disponibles ese día.</p>}
        {slots.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setSelectedSlot(s)}
            className={`rounded-lg px-3.5 py-2 font-mono text-xs ${selectedSlot === s ? "bg-cyan/15 text-cyan" : "bg-surface/6 text-text-muted"
              }`}
          >
            {new Date(s).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" })}
          </button>
        ))}
      </div>

      <select name="serviceCategory" required className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm">
        {SERVICE_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <input name="name" placeholder="Nombre completo" required className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />
      <input name="email" type="email" placeholder="Correo" required className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />
      <input name="phone" placeholder="Teléfono" required className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />
      <textarea name="notes" placeholder="Cuéntanos brevemente el problema (opcional)" rows={2} className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />

      {result && !result.success && <p className="text-xs text-danger">{result.message}</p>}

      <button
        type="submit"
        disabled={!selectedSlot || isPending}
        className="rounded-full bg-text py-3 font-display text-sm font-medium text-bg disabled:opacity-40"
      >
        {isPending ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}

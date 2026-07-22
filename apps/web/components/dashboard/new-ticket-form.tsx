// apps/web/components/dashboard/new-ticket-form.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTicketAction } from "@/lib/actions/ticket.actions";

const DEVICE_TYPES = [
  ["LAPTOP", "Portátil"], ["DESKTOP", "Computador de escritorio"], ["SMARTPHONE", "Celular"],
  ["TABLET", "Tablet"], ["SMART_TV", "Smart TV"], ["MONITOR", "Monitor"], ["GPU", "Tarjeta gráfica"],
  ["MOTHERBOARD", "Placa madre"], ["CONSOLE_XBOX", "Xbox"], ["CONSOLE_PLAYSTATION", "PlayStation"],
  ["CONSOLE_NINTENDO", "Nintendo"], ["PRINTER", "Impresora"], ["OTHER", "Otro"],
] as const;

const CATEGORIES = [
  ["HARDWARE_REPAIR", "Reparación de hardware"], ["DATA_RECOVERY", "Recuperación de datos"],
  ["CLEANING", "Limpieza"], ["COMPONENT_UPGRADE", "Cambio de componentes"], ["OPTIMIZATION", "Optimización"],
  ["SOFTWARE_DEVELOPMENT", "Desarrollo de software"], ["EMBEDDED_SYSTEMS", "Sistemas embebidos"],
  ["CONSULTING", "Consultoría"],
] as const;

export function NewTicketForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
     const result = await createTicketAction(formData);

if (result.success === false) {
  setError(result.error);
  return;
}

router.push(`/panel/reparaciones/${result.ticketId}`);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="clientEmail" type="email" placeholder="Correo del cliente" required
          className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm sm:col-span-2" />
        <p className="-mt-2 text-xs text-text-muted sm:col-span-2">
          Si el correo ya existe, se usa ese cliente. Si no, se crea uno nuevo con estos datos.
        </p>
        <input name="clientName" placeholder="Nombre del cliente" required
          className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />
        <input name="clientPhone" placeholder="Teléfono (opcional)"
          className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select name="deviceType" required className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm">
          {DEVICE_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <input name="brand" placeholder="Marca (ej: Dell, Apple, Sony)" required
          className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />
        <input name="model" placeholder="Modelo (opcional)"
          className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm sm:col-span-2" />
      </div>

      <select name="category" required className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm">
        {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <textarea name="problemDescription" placeholder="Descripción del problema reportado por el cliente" rows={3} required
        className="rounded-lg border border-border/10 bg-surface/5 p-2.5 text-sm" />

      {error && <p className="text-xs text-danger">{error}</p>}

      <button type="submit" disabled={isPending}
        className="rounded-full bg-text py-3 font-display text-sm font-medium text-bg disabled:opacity-50">
        {isPending ? "Creando ticket..." : "Crear ticket"}
      </button>
    </form>
  );
}

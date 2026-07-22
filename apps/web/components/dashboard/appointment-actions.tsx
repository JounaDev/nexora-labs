// apps/web/components/dashboard/appointment-actions.tsx
"use client";

import { useTransition } from "react";
import { updateAppointmentStatusAction } from "@/lib/actions/appointment.actions";

export function AppointmentActions({ appointmentId, status }: { appointmentId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  if (status !== "PENDING" && status !== "CONFIRMED") {
    return <span className="font-mono text-xs text-text-muted">—</span>;
  }

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <button
          disabled={isPending}
         onClick={() =>
  startTransition(async () => {
    await updateAppointmentStatusAction(
      appointmentId,
      "CONFIRMED"
    );
  })
}
          className="rounded-full bg-cyan/15 px-3 py-1 font-mono text-xs text-cyan disabled:opacity-40"
        >
          Confirmar
        </button>
      )}
      <button
        disabled={isPending}
        onClick={() =>
  startTransition(async () => {
    await updateAppointmentStatusAction(
      appointmentId,
      "CANCELLED"
    );
  })
}
        className="rounded-full bg-danger/15 px-3 py-1 font-mono text-xs text-danger disabled:opacity-40"
      >
        Cancelar
      </button>
    </div>
  );
}

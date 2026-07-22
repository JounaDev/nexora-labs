// apps/web/components/dashboard/status-changer.tsx
"use client";

import { useRef, useState, useTransition } from "react";
import { changeTicketStatusAction } from "@/lib/actions/ticket.actions";
import { getNextValidStatuses } from "@/lib/ticket-flow";
import clsx from "clsx";

const LABELS: Record<string, string> = {
  DIAGNOSIS: "Diagnóstico",
  AWAITING_PARTS: "Repuestos",
  IN_REPAIR: "En reparación",
  TESTING: "Pruebas",
  COMPLETED: "Finalizado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelar",
};

export function StatusChanger({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const nextStatuses = getNextValidStatuses(currentStatus);

  if (nextStatuses.length === 0) {
    return <p className="text-sm text-text-muted">Este ticket ya está en un estado final.</p>;
  }

  function handleClick(newStatus: string) {
    setError(null);
    const formData = new FormData();
    formData.set("ticketId", ticketId);
    formData.set("newStatus", newStatus);
    if (noteRef.current?.value) formData.set("note", noteRef.current.value);

    startTransition(async () => {
    const result = await changeTicketStatusAction(formData);

if (result.success === false) {
  setError(result.error);
  return;
}

if (noteRef.current) {
  noteRef.current.value = "";
}
    });
  }

  return (
    <div>
      <textarea
        ref={noteRef}
        placeholder="Nota opcional para este cambio de estado..."
        className="mb-3 w-full rounded-lg border border-border/10 bg-surface/5 p-3 text-sm text-text placeholder:text-text-muted"
        rows={2}
      />
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((status) => (
          <button
            key={status}
            disabled={isPending}
            onClick={() => handleClick(status)}
            className={clsx(
              "rounded-full px-4 py-2 font-mono text-xs transition-colors disabled:opacity-50",
              status === "CANCELLED"
                ? "bg-danger/15 text-danger hover:bg-danger/25"
                : "bg-cyan/15 text-cyan hover:bg-cyan/25"
            )}
          >
            {isPending ? "..." : `→ ${LABELS[status]}`}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}

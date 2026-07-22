"use client";

import { useState, useTransition } from "react";
import { assignTechnicianAction } from "@/lib/actions/ticket.actions";
import { GlassCard, Button } from "@nexora/ui/components";

interface Technician {
  id: string;
  user: {
    name: string;
  };
}

interface Props {
  ticketId: string;
  currentTechnicianId: string | null;
  technicians: Technician[];
}

export function AssignTechnicianCard({
  ticketId,
  currentTechnicianId,
  technicians,
}: Props) {
  const [selectedTechnician, setSelectedTechnician] = useState(
    currentTechnicianId ?? ""
  );

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAssign() {
    setError(null);

    const formData = new FormData();

    formData.set("ticketId", ticketId);

    if (selectedTechnician) {
      formData.set("technicianId", selectedTechnician);
    }

    startTransition(async () => {
      const result = await assignTechnicianAction(formData);

      if (!result.success) {
        setError(result.error ?? "Ocurrió un error.");
      }
    });
  }

  return (
    <GlassCard>
      <h3 className="mb-3 font-display text-sm font-bold">
        Técnico asignado
      </h3>

      <select
        value={selectedTechnician}
        onChange={(e) => setSelectedTechnician(e.target.value)}
        className="mb-4 w-full rounded-lg border border-border/10 bg-surface/5 p-3 text-sm"
      >
        <option value="">Sin asignar</option>

        {technicians.map((technician) => (
          <option
            key={technician.id}
            value={technician.id}
          >
            {technician.user.name}
          </option>
        ))}
      </select>

      <Button
        onClick={handleAssign}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Asignando..." : "Guardar"}
      </Button>

      {error && (
        <p className="mt-3 text-xs text-danger">
          {error}
        </p>
      )}
    </GlassCard>
  );
}
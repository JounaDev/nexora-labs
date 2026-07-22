"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { GlassCard, Button } from "@nexora/ui/components";

export default function SeguimientoPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");

  function buscarTicket() {
    if (!codigo.trim()) return;

    router.push(`/seguimiento/${codigo.trim().toUpperCase()}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <GlassCard
        scan={false}
        className="w-full max-w-2xl p-10 text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan/10">
            <Search className="h-10 w-10 text-cyan" />
          </div>
        </div>

        <h1 className="mb-3 font-display text-4xl font-black">
          Seguimiento de reparación
        </h1>

        <p className="mb-8 text-text-muted">
          Consulta en tiempo real el estado de tu equipo ingresando el código de
          tu ticket.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") buscarTicket();
            }}
            placeholder="Ej: NX 2F403KX"
            className="flex-1 rounded-full border border-border/10 bg-surface/5 px-5 py-3 outline-none focus:border-cyan"
          />

          <Button
            onClick={buscarTicket}
            scan
          >
            Buscar
          </Button>
        </div>

        <p className="mt-8 text-xs text-text-muted">
          El código se encuentra en el comprobante entregado al momento de
          recibir tu equipo.
        </p>
      </GlassCard>
    </main>
  );
}


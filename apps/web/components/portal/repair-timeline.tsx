// apps/web/components/portal/repair-timeline.tsx
"use client";

import clsx from "clsx";

const ORDER = ["RECEIVED", "DIAGNOSIS", "AWAITING_PARTS", "IN_REPAIR", "TESTING", "COMPLETED"] as const;

const LABELS: Record<(typeof ORDER)[number], string> = {
  RECEIVED: "Recibido",
  DIAGNOSIS: "Diagnóstico",
  AWAITING_PARTS: "Repuestos",
  IN_REPAIR: "Reparación",
  TESTING: "Pruebas",
  COMPLETED: "Finalizado",
};

type TrackableStatus = (typeof ORDER)[number];

export function RepairTimeline({ status }: { status: string }) {
  // CANCELLED / DELIVERED no tienen posición en la barra de progreso —
  // se muestran aparte en la página que consume este componente.
  const currentIndex = ORDER.indexOf(status as TrackableStatus);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const progressPct = (safeIndex / (ORDER.length - 1)) * 100;

  return (
    <div className="px-1">
      <div className="relative my-7 h-[3px] rounded-full bg-surface/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple to-cyan transition-[width] duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="-mt-10 flex justify-between">
        {ORDER.map((step, i) => {
          const isDone = i < safeIndex;
          const isCurrent = i === safeIndex;
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div
                className={clsx(
                  "relative h-4 w-4 rounded-full border-2 transition-all",
                  isDone || isCurrent ? "border-cyan bg-cyan" : "border-border/20 bg-surface/15"
                )}
              >
                {isCurrent && (
                  <span className="absolute -inset-1.5 animate-pulse-ring rounded-full border border-cyan" />
                )}
              </div>
              <span
                className={clsx(
                  "max-w-[70px] font-mono text-[0.62rem]",
                  isCurrent ? "text-text" : "text-text-muted"
                )}
              >
                {LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

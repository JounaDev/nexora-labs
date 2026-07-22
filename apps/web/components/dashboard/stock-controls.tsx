// apps/web/components/dashboard/stock-controls.tsx
"use client";

import { useTransition } from "react";
import { adjustStockAction } from "@/lib/actions/inventory.actions";

export function StockControls({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();

  function adjust(delta: number) {
    startTransition(async () => {
      await adjustStockAction(itemId, delta);
    });
  }

  return (
    <div className="flex gap-1">
      <button
        disabled={isPending}
        onClick={() => adjust(-1)}
        className="h-6 w-6 rounded bg-surface/8 text-xs text-text-muted hover:text-text disabled:opacity-40"
      >
        −
      </button>

      <button
        disabled={isPending}
        onClick={() => adjust(1)}
        className="h-6 w-6 rounded bg-surface/8 text-xs text-text-muted hover:text-text disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
// apps/web/components/dashboard/invoice-actions.tsx
"use client";

import { useTransition } from "react";
import { generateInvoiceAction, markInvoicePaidAction } from "@/lib/actions/invoice.actions";

export function GenerateInvoiceButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() =>
  startTransition(async () => {
    await generateInvoiceAction(ticketId);
  })
}
      className="rounded-full bg-cyan/15 px-3 py-1.5 font-mono text-xs text-cyan disabled:opacity-40"
    >
      {isPending ? "Generando..." : "Generar factura"}
    </button>
  );
}

export function MarkPaidButton({ invoiceId }: { invoiceId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() =>
  startTransition(async () => {
    await markInvoicePaidAction(invoiceId);
  })
}
      className="rounded-full bg-success/15 px-3 py-1.5 font-mono text-xs text-success disabled:opacity-40"
    >
      {isPending ? "..." : "Marcar pagada"}
    </button>
  );
}

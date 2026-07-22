// apps/web/components/shared/wompi-pay-card.tsx
import { GlassCard } from "@nexora/ui/components";
import { getOrCreatePayableInvoice } from "@/lib/services/invoice.service";

import { createWompiCheckout } from "@/lib/actions/payments";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const PAYABLE_STATUSES = ["TESTING", "COMPLETED", "DELIVERED"];

// returnPath: a dónde vuelve el usuario después de pagar (distinto para
// admin y portal, cada uno pasa la suya).
export async function WompiPayCard({
  ticketId,
  trackingCode,
  status,
  paymentStatus,
  returnPath,
}: {
  ticketId: string;
  trackingCode: string;
  status: string;
  paymentStatus: string;
  returnPath: string;
})  {
  if (!PAYABLE_STATUSES.includes(status)) return null;

  let invoice;
  try {
   invoice = await getOrCreatePayableInvoice(ticketId);
  } catch {
    return null; // no rompe la página si algo falla generando la factura
  }
if (!invoice || paymentStatus === "PAID") {
  return null;
}



 return (
  <GlassCard className="mb-6 !border-cyan/25 !bg-cyan/5">
 <h3 className="mb-2 font-display text-sm font-bold">
  Estado del pago
</h3>

<div className="mb-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold ${
      paymentStatus === "PAID"
        ? "bg-emerald-500/20 text-emerald-400"
        : paymentStatus === "PENDING"
        ? "bg-yellow-500/20 text-yellow-400"
        : paymentStatus === "REFUNDED"
        ? "bg-red-500/20 text-red-400"
        : paymentStatus === "WAIVED"
        ? "bg-cyan-500/20 text-cyan-400"
        : "bg-gray-500/20 text-gray-400"
    }`}
  >
    {paymentStatus}
  </span>
</div>

    <p className="mb-4 text-sm text-text-muted">
      {invoice.number} ·{" "}
      <span className="font-mono text-text">
        {currency.format(Number(invoice.total))}
      </span>
    </p>

    <form action={createWompiCheckout}>
  <input
    type="hidden"
    name="trackingCode"
    value={trackingCode}
  />

  <input
    type="hidden"
    name="returnPath"
    value={returnPath}
  />

  <button
    type="submit"
    className="inline-block rounded-full bg-cyan/15 px-5 py-2.5 font-mono text-xs text-cyan transition hover:bg-cyan/25"
  >
    Pagar con Wompi
  </button>
</form>
  </GlassCard>
);
}

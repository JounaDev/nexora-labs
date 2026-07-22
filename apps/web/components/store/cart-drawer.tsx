// apps/web/components/store/cart-drawer.tsx
"use client";

import { useState, useTransition } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createOrderAndGetWompiUrlAction } from "@/lib/actions/order.actions";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [showWompiForm, setShowWompiForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { items, removeItem, setQuantity, total, count } = useCart();

  function checkoutOnWhatsapp() {
    const lines = items.map((i) => `• ${i.quantity}× ${i.name} — ${currency.format(i.price * i.quantity)}`);
    const message = encodeURIComponent(
      `Hola, quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${currency.format(total)}`
    );
    window.open(`https://wa.me/573026565767?text=${message}`, "_blank");
  }

  function checkoutOnWompi() {
    setError(null);
    if (!email || !name) return setError("Escribe tu nombre y correo primero");

    startTransition(async () => {
      startTransition(async () => {
  const result = await createOrderAndGetWompiUrlAction({
    items: items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
    name,
    email,
  });

  if (result.success === false) {
    setError(result.error);
    return;
  }

  window.location.href = result.checkoutUrl;
});
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 rounded-full px-5 text-sm"
      >
        <ShoppingBag size={16} />
        {count > 0 && <span className="font-mono text-cyan">{count}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setOpen(false)}>
          <div className="glass flex h-full w-full max-w-sm flex-col p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold">Tu carrito</h3>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {items.length === 0 && <p className="text-sm text-text-muted">Tu carrito está vacío.</p>}
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <p>{item.name}</p>
                    <p className="font-mono text-xs text-text-muted">{currency.format(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                      className="w-12 rounded bg-surface/8 px-1 py-0.5 text-center text-xs"
                    />
                    <button onClick={() => removeItem(item.productId)} className="text-xs text-danger">
                      quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="mt-4 border-t border-border/10 pt-4">
                <div className="mb-3 flex justify-between font-display font-bold">
                  <span>Total</span>
                  <span>{currency.format(total)}</span>
                </div>

                <button onClick={checkoutOnWhatsapp} className="mb-2 w-full rounded-full bg-text py-3 text-sm font-medium text-bg">
                  Pedir por WhatsApp
                </button>

                {showWompiForm ? (
                  <div className="flex flex-col gap-2">
                    <input
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-lg border border-border/10 bg-surface/5 p-2 text-sm"
                    />
                    <input
                      placeholder="Tu correo"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-lg border border-border/10 bg-surface/5 p-2 text-sm"
                    />
                    {error && <p className="text-xs text-danger">{error}</p>}
                    <button
                      onClick={checkoutOnWompi}
                      disabled={isPending}
                      className="w-full rounded-full border border-cyan/30 py-3 text-sm font-medium text-cyan disabled:opacity-50"
                    >
                      {isPending ? "Redirigiendo..." : "Confirmar y pagar"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowWompiForm(true)}
                    className="w-full rounded-full border border-border/15 py-3 text-sm text-text-muted"
                  >
                    Pagar en línea con Wompi
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

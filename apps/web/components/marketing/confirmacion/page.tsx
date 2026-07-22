// apps/web/app/(marketing)/tienda/confirmacion/page.tsx

import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";

interface Props {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { order } = await searchParams;

  const orderData = order
    ? await prisma.order.findUnique({
        where: { id: order },
      })
    : null;

  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center sm:px-10">
      <GlassCard>
        <h1 className="mb-3 font-display text-2xl font-black">
          {orderData?.status === "PAID"
            ? "¡Pago confirmado!"
            : "Verificando tu pago..."}
        </h1>

        <p className="text-sm text-text-muted">
          {orderData?.status === "PAID"
            ? "Gracias por tu compra. Te vamos a escribir para coordinar la entrega."
            : "Wompi puede tardar unos segundos en confirmar. Si ya pagaste y esto no cambia, escríbenos por WhatsApp con tu número de pedido."}
        </p>

        {orderData && (
          <p className="mt-4 font-mono text-xs text-text-muted">
            Pedido: {orderData.id}
          </p>
        )}
      </GlassCard>
    </section>
  );
}
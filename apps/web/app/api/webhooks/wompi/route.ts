// apps/web/app/api/webhooks/wompi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nexora/database/client";
import { verifyWompiWebhookSignature } from "@/lib/wompi";

// Wompi tiene que poder llegar a esta URL desde internet — en local no la va
// a poder llamar nunca (no le pega a localhost). Para probar en desarrollo,
// usa algo como ngrok y registra esa URL pública en tu dashboard de Wompi.
export async function POST(req: NextRequest) {
  const body = await req.json();

  const isValid = verifyWompiWebhookSignature(body);
  if (!isValid) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const transaction = body.data?.transaction;
  if (!transaction || transaction.status !== "APPROVED") {
    return NextResponse.json({ received: true }); // otros estados (DECLINED, VOIDED) no hacen nada por ahora
  }

  const reference: string = transaction.reference;

  // La referencia puede ser el número de una factura (tickets) o el id de un pedido (tienda).
  const invoice = await prisma.invoice.findUnique({ where: { number: reference } });

  if (invoice && invoice.status !== "PAID") {
    const existingPayment = await prisma.payment.findFirst({
  where: {
    reference: transaction.id,
  },
});

if (existingPayment) {
  return NextResponse.json({
    received: true,
    updated: "already_processed",
  });
}
  await prisma.$transaction([
  prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
    },
  }),

  prisma.repairTicket.update({
    where: {
      id: invoice.ticketId!,
    },
    data: {
      paymentStatus: "PAID",
    },
  }),

  prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: invoice.total,
      method: "CARD",
      reference: transaction.id,
    },
  }),
]);
    return NextResponse.json({ received: true, updated: "invoice" });
  }

  const order = await prisma.order.findUnique({ where: { id: reference } });
  if (order && order.status !== "PAID") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
    return NextResponse.json({ received: true, updated: "order" });
  }

  return NextResponse.json({ received: true, updated: "none" });
}

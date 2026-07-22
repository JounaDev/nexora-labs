// apps/web/lib/actions/invoice.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@nexora/database/client";
import { auth } from "@/auth";
import { generateInvoiceForTicket } from "@/lib/services/invoice.service";

export async function generateInvoiceAction(ticketId: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
    return { success: false, error: "No autorizado" };
  }

  try {
    await generateInvoiceForTicket(ticketId);
    revalidatePath("/panel/facturacion");
    revalidatePath(`/panel/reparaciones/${ticketId}`);
    revalidatePath(`/mi-cuenta/reparaciones/${ticketId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "No se pudo generar la factura" };
  }
}

export async function markInvoicePaidAction(invoiceId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "No autorizado" };
  }

  const invoice = await prisma.invoice.findUniqueOrThrow({ where: { id: invoiceId } });

  await prisma.$transaction([
    prisma.invoice.update({ where: { id: invoiceId }, data: { status: "PAID", paidAt: new Date() } }),
    prisma.payment.create({ data: { invoiceId, amount: invoice.total, method: "CASH" } }),
  ]);

  revalidatePath("/panel/facturacion");
  return { success: true };
}

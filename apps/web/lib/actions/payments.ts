"use server";

import { redirect } from "next/navigation";
import { prisma } from "@nexora/database/client";
import { generateWompiCheckoutUrl } from "@/lib/wompi";

export async function createWompiCheckout(formData: FormData) {
  const trackingCode = formData.get("trackingCode") as string;

  const returnPath =
    (formData.get("returnPath") as string) ||
    `/seguimiento/${trackingCode}`;

  if (!trackingCode) {
    throw new Error("Código de seguimiento inválido.");
  }

  const ticket = await prisma.repairTicket.findUnique({
    where: {
      trackingCode,
    },
    include: {
      invoice: true,
    },
  });

  if (!ticket) {
    throw new Error("Ticket no encontrado.");
  }

  if (!ticket.invoice) {
    throw new Error("El ticket no tiene una factura.");
  }

  if (ticket.invoice.status === "PAID") {
    throw new Error("La factura ya fue pagada.");
  }

  const finalCost = Number(ticket.finalCost ?? 0);

  if (finalCost <= 0) {
    throw new Error("El ticket no tiene un valor válido para cobrar.");
  }

  const checkoutUrl = generateWompiCheckoutUrl({
    amountInCents: Math.round(finalCost * 100),
    reference: ticket.invoice.number,
    redirectUrl:
      process.env.NODE_ENV === "development"
        ? ""
        : `${process.env.WEB_APP_URL}${returnPath}`,
  });

  if (!checkoutUrl) {
    throw new Error("No fue posible generar el checkout de Wompi.");
  }

  redirect(checkoutUrl);
}
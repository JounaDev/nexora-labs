// apps/web/lib/services/invoice.service.ts
import { prisma } from "@nexora/database/client";

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({ where: { number: { startsWith: `FAC-${year}-` } } });
  return `FAC-${year}-${String(count + 1).padStart(5, "0")}`;
}

// Colombia: IVA general 19%, pero muchos servicios de reparación y repuestos
// tienen tratamientos distintos según el caso — dejo el cálculo en 0% por
// defecto para no inventar una tarifa incorrecta. Ajusta TAX_RATE cuando
// confirmes el régimen tributario real del negocio.
const TAX_RATE = 0;

export async function generateInvoiceForTicket(ticketId: string) {
  const ticket = await prisma.repairTicket.findUniqueOrThrow({
    where: { id: ticketId },
    include: { parts: true, invoice: true },
  });

  if (ticket.invoice) throw new Error("Este ticket ya tiene una factura generada");

  const partsTotal = ticket.parts.reduce((sum, p) => sum + Number(p.unitPrice) * p.quantity, 0);
  const laborTotal = ticket.finalCost ? Number(ticket.finalCost) : 0;
  const subtotal = partsTotal + laborTotal;
  const tax = subtotal * TAX_RATE;

  const number = await generateInvoiceNumber();

  return prisma.invoice.create({
    data: {
      number,
      ticketId: ticket.id,
      clientId: ticket.clientId,
      status: "ISSUED",
      subtotal,
      tax,
      total: subtotal + tax,
    },
  });
}

// Para el link de pago del ticket: si ya hay factura la reutiliza, si no la
// genera al vuelo. Si el total calculado es 0 (sin finalCost ni repuestos
// con costo todavía), devuelve null — no tiene sentido mostrar un link de
// pago por $0.
export async function getOrCreatePayableInvoice(ticketId: string) {
  const existing = await prisma.invoice.findUnique({ where: { ticketId } });
  const invoice = existing ?? (await generateInvoiceForTicket(ticketId));
  if (Number(invoice.total) <= 0) return null;
  return invoice;
}

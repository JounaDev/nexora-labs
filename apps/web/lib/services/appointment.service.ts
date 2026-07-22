// apps/web/lib/services/appointment.service.ts
import { prisma } from "@nexora/database/client";
import type { ServiceCategory } from "@prisma/client";

import type { AppointmentStatus } from "@prisma/client";

const BUSINESS_HOURS = { start: 8, end: 17 }; // slots de 1 hora, 8am–5pm

export async function getAvailableSlots(date: Date, locationId?: string): Promise<Date[]> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const existing = await prisma.appointment.findMany({
    where: { locationId, scheduledAt: { gte: dayStart, lte: dayEnd }, status: { not: "CANCELLED" } },
    select: { scheduledAt: true },
  });
  const bookedHours = new Set(existing.map((a) => a.scheduledAt.getHours()));

  const slots: Date[] = [];
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    if (bookedHours.has(hour)) continue;
    const slot = new Date(date);
    slot.setHours(hour, 0, 0, 0);
    if (slot.getTime() > Date.now()) slots.push(slot);
  }
  return slots;
}

interface CreateAppointmentInput {
  clientId: string;
  locationId?: string;
  technicianId?: string;
  serviceCategory: ServiceCategory;
  scheduledAt: Date;
  notes?: string;
}

export async function createAppointment(input: CreateAppointmentInput) {
  // Re-verifica el cupo dentro de la transacción para reducir (no eliminar del todo)
  // la ventana de doble reserva simultánea. El cierre real es un índice único en DB:
  // ver nota en ECOMMERCE... digo, en RESERVAS_CHAT_IA.md.
  return prisma.$transaction(async (tx) => {
    const conflict = await tx.appointment.findFirst({
      where: { locationId: input.locationId, scheduledAt: input.scheduledAt, status: { not: "CANCELLED" } },
    });
    if (conflict) throw new Error("Ese horario ya no está disponible, elige otro.");

    return tx.appointment.create({ data: { ...input, status: "PENDING" } });
  });
}


export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });
}
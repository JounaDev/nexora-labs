// apps/web/lib/services/ticket.service.ts
//
// Toda la lógica de negocio de "cambiar el estado de un ticket" vive acá,
// no en el Server Action ni en el componente — así la Fase 8 (notificaciones)
// y un futuro endpoint de API para app móvil pueden llamar exactamente esto
// sin duplicar reglas.

import { prisma } from "@nexora/database/client";
import { Role } from "@prisma/client";
import { generateTrackingCode } from "@/lib/tracking-code";

import { isValidTransition, type FlowStatus as Status } from "@/lib/ticket-flow";
interface CreateTicketInput {
  clientEmail: string;
  clientName: string;
  clientPhone?: string;

  deviceType: "LAPTOP" | "DESKTOP" | "SMARTPHONE" | "TABLET" | "SMART_TV" |
  "MONITOR" | "GPU" | "MOTHERBOARD" | "CONSOLE_XBOX" |
  "CONSOLE_PLAYSTATION" | "CONSOLE_NINTENDO" | "PRINTER" | "OTHER";

  brand: string;
  model?: string;

  category: Status extends never ? never : any;
  problemDescription: string;
}
interface ChangeStatusInput {
  ticketId: string;
  newStatus: Status;
  note?: string;
  changedById: string;
}
interface AssignTechnicianInput {
  ticketId: string;
  technicianId: string | null;
}
export async function changeTicketStatus({ ticketId, newStatus, note, changedById }: ChangeStatusInput) {
  const ticket = await prisma.repairTicket.findUniqueOrThrow({ where: { id: ticketId } });

  if (!isValidTransition(ticket.status, newStatus)) {
    throw new Error(`No se puede pasar de "${ticket.status}" a "${newStatus}"`);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.repairTicket.update({
      where: { id: ticketId },
      data: {
        status: newStatus,
        completedAt: newStatus === "COMPLETED" ? new Date() : ticket.completedAt,
      },
    });

    await tx.repairStatusHistory.create({
      data: { ticketId, status: newStatus, note, changedById },
    });

    // Al completar, la garantía se activa sola — nadie tiene que acordarse de crearla a mano.
    if (newStatus === "COMPLETED") {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + ticket.warrantyMonths);

      await tx.warranty.upsert({
        where: { ticketId },
        create: { ticketId, endDate },
        update: { endDate, isActive: true },
      });
    }

    return updated;
  });

}


export async function createTicket(input: CreateTicketInput) {
  return prisma.$transaction(async (tx) => {
    // Buscar usuario
    let user = await tx.user.findUnique({
      where: {
        email: input.clientEmail,
      },
    });

    // Crear usuario si no existe
    if (!user) {
      user = await tx.user.create({
        data: {
          name: input.clientName,
          email: input.clientEmail,
          phone: input.clientPhone,
          role: Role.CLIENT,
        },
      });
    }

    // Buscar perfil
    let client = await tx.clientProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

    // Crear perfil si no existe
    if (!client) {
      client = await tx.clientProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Crear dispositivo
    const device = await tx.device.create({
      data: {
        clientId: client.id,
        type: input.deviceType,
        brand: input.brand,
        model: input.model || null,
      },
    });




    // Obtener último ticket del año
    const year = new Date().getFullYear();

    const lastTicket = await tx.repairTicket.findFirst({
      where: {
        code: {
          startsWith: `NL-${year}-`,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let sequence = 1;

    if (lastTicket) {
      const lastNumber = Number(lastTicket.code.split("-")[2]);

      if (!Number.isNaN(lastNumber)) {
        sequence = lastNumber + 1;
      }
    }

    const code = `NL-${year}-${sequence
      .toString()
      .padStart(6, "0")}`;

    // Crear ticket
    // Generar un código de seguimiento único
    let trackingCode: string;

    while (true) {
      trackingCode = generateTrackingCode();

      const exists = await tx.repairTicket.findUnique({
        where: {
          trackingCode,
        },
        select: {
          id: true,
        },
      });

      if (!exists) {
        break;
      }
    }

    const ticket = await tx.repairTicket.create({
      data: {
        code,
        trackingCode,
        clientId: client.id,
        deviceId: device.id,

        category: input.category,
        problemDescription: input.problemDescription,

        status: "RECEIVED",
        priority: "NORMAL",
      },
    });

    // Historial inicial
    await tx.repairStatusHistory.create({
      data: {
        ticketId: ticket.id,
        status: "RECEIVED",
        note: "Ticket creado",
        changedById: user.id,
      },
    });

    return ticket;

  });
}

export async function assignTechnician({
  ticketId,
  technicianId,
}: AssignTechnicianInput) {
  await prisma.repairTicket.findUniqueOrThrow({
    where: {
      id: ticketId,
    },
  });

  if (technicianId) {
    const technician = await prisma.technicianProfile.findUnique({
      where: {
        id: technicianId,
      },
      include: {
        user: true,
      },
    });

    if (!technician) {
      throw new Error("El técnico seleccionado no existe.");
    }
  }

  return prisma.repairTicket.update({
    where: {
      id: ticketId,
    },
    data: {
      technicianId,
    },
  });


}

interface UpdateRepairCostsInput {
  ticketId: string;
  laborCost: number;
  partsCost: number;
  discount: number;
  tax: number;
}

export async function updateRepairCosts({
  ticketId,
  laborCost,
  partsCost,
  discount,
  tax,
}: UpdateRepairCostsInput) {
  await prisma.repairTicket.findUniqueOrThrow({
    where: {
      id: ticketId,
    },
  });

  const finalCost =
    laborCost +
    partsCost +
    tax -
    discount;

  const subtotal =
    laborCost +
    partsCost;

  const ticket = await prisma.repairTicket.update({
    where: {
      id: ticketId,
    },
    data: {
      laborCost,
      partsCost,
      discount,
      tax,
      finalCost,
    },
  });

  await prisma.invoice.updateMany({
    where: {
      ticketId,
    },
    data: {
      subtotal,
      tax,
      total: finalCost,
    },
  });

  return ticket;
}
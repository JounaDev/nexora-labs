"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  changeTicketStatus,
  createTicket,
  assignTechnician,
  updateRepairCosts,
} from "@/lib/services/ticket.service";

type ActionResult = {
  success: boolean;
  error?: string;
};

type CreateTicketActionResult =
  | {
      success: true;
      ticketId: string;
    }
  | {
      success: false;
      error: string;
    };

// =====================================================
// Crear Ticket
// =====================================================

export async function createTicketAction(
  formData: FormData
): Promise<CreateTicketActionResult> {
  const session = await auth();

  if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  try {
    const ticket = await createTicket({
      clientEmail: formData.get("clientEmail") as string,
      clientName: formData.get("clientName") as string,
      clientPhone: (formData.get("clientPhone") as string) || undefined,

      deviceType: formData.get("deviceType") as any,

      brand: formData.get("brand") as string,
      model: (formData.get("model") as string) || undefined,

      category: formData.get("category") as any,

      problemDescription:
        formData.get("problemDescription") as string,
    });

    revalidatePath("/panel/reparaciones");

    return {
      success: true,
      ticketId: ticket.id,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Error al crear el ticket",
    };
  }
  
}

// =====================================================
// Cambiar Estado
// =====================================================


export async function changeTicketStatusAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  const ticketId = formData.get("ticketId") as string;
  const newStatus = formData.get("newStatus") as string;
  const note = (formData.get("note") as string) || undefined;
console.log("SESSION USER:");
console.log(session.user);

console.log("USER ID:");
console.log(session.user.id);
  try {
    await changeTicketStatus({
      ticketId,
      newStatus:
        newStatus as Parameters<typeof changeTicketStatus>[0]["newStatus"],
      note,
      changedById: session.user.id,
    });
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "No se pudo cambiar el estado",
    };
  }

  revalidatePath(`/panel/reparaciones/${ticketId}`);
  revalidatePath(`/mi-cuenta/reparaciones/${ticketId}`);

  return {
    success: true,
  };
}

// =====================================================
// Asignar Técnico
// =====================================================

export async function assignTechnicianAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  const ticketId = formData.get("ticketId") as string;
  const technicianId =
    (formData.get("technicianId") as string) || null;

  try {
    await assignTechnician({
      ticketId,
      technicianId,
    });
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "No se pudo asignar el técnico",
    };
  }

  revalidatePath(`/panel/reparaciones/${ticketId}`);
  revalidatePath("/panel/reparaciones");

  return {
    success: true,
  };
}

// =====================================================
// Actualizar Costos
// =====================================================

export async function updateRepairCostsAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  const ticketId = formData.get("ticketId") as string;

  const laborCost = Number(formData.get("laborCost") ?? 0);
  const partsCost = Number(formData.get("partsCost") ?? 0);
  const discount = Number(formData.get("discount") ?? 0);
  const tax = Number(formData.get("tax") ?? 0);

  try {
    await updateRepairCosts({
      ticketId,
      laborCost,
      partsCost,
      discount,
      tax,
    });
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "No se pudieron actualizar los costos",
    };
  }

  revalidatePath(`/panel/reparaciones/${ticketId}`);
  revalidatePath("/panel/reparaciones");

  return {
    success: true,
  };
}
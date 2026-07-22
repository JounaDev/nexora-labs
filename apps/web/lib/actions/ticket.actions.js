"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { changeTicketStatus, createTicket, } from "@/lib/services/ticket.service";
// =====================================================
// Crear Ticket
// =====================================================
export async function createTicketAction(formData) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
        return {
            success: false,
            error: "No autorizado",
        };
    }
    try {
        const ticket = await createTicket({
            clientEmail: formData.get("clientEmail"),
            clientName: formData.get("clientName"),
            clientPhone: formData.get("clientPhone") || undefined,
            deviceType: formData.get("deviceType"),
            brand: formData.get("brand"),
            model: formData.get("model") || undefined,
            category: formData.get("category"),
            problemDescription: formData.get("problemDescription"),
        });
        revalidatePath("/panel/reparaciones");
        return {
            success: true,
            ticketId: ticket.id,
        };
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error
                ? err.message
                : "Error al crear el ticket",
        };
    }
}
// =====================================================
// Cambiar Estado
// =====================================================
export async function changeTicketStatusAction(formData) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
        return {
            success: false,
            error: "No autorizado",
        };
    }
    const ticketId = formData.get("ticketId");
    const newStatus = formData.get("newStatus");
    const note = formData.get("note") || undefined;
    try {
        await changeTicketStatus({
            ticketId,
            newStatus: newStatus,
            note,
            changedById: session.user.id,
        });
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error
                ? err.message
                : "Error inesperado",
        };
    }
    revalidatePath(`/panel/reparaciones/${ticketId}`);
    revalidatePath(`/mi-cuenta/reparaciones/${ticketId}`);
    return {
        success: true,
    };
}

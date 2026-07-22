// apps/web/lib/actions/appointment.actions.ts
"use server";
import { z } from "zod";
import { prisma } from "@nexora/database/client";
import { getAvailableSlots, createAppointment, updateAppointmentStatus, } from "@/lib/services/appointment.service";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
export async function getAvailableSlotsAction(dateISO) {
    const slots = await getAvailableSlots(new Date(dateISO));
    return slots.map((s) => s.toISOString());
}
const bookingSchema = z.object({
    name: z.string().min(2, "Nombre muy corto"),
    email: z.string().email("Correo inválido"),
    phone: z.string().min(7, "Teléfono inválido"),
    serviceCategory: z.string(),
    scheduledAt: z.string(),
    notes: z.string().optional(),
});
export async function createAppointmentAction(formData) {
    const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success)
        return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    const { name, email, phone, serviceCategory, scheduledAt, notes } = parsed.data;
    // Reserva pública: si el correo no existe, se crea una cuenta "ligera" (sin password).
    // El cliente puede activarla luego con el magic link de Fase 4 — no necesita
    // registrarse formalmente solo para agendar un diagnóstico.
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: { name, email, phone, role: "CLIENT", clientProfile: { create: {} } },
        });
    }
    const clientProfile = await prisma.clientProfile.findUniqueOrThrow({ where: { userId: user.id } });
    try {
        const appointment = await createAppointment({
            clientId: clientProfile.id,
            serviceCategory: serviceCategory,
            scheduledAt: new Date(scheduledAt),
            notes,
        });
        await sendAppointmentConfirmationEmail({ to: email, name, scheduledAt: appointment.scheduledAt });
        const message = encodeURIComponent(`Hola, soy ${name}. Reservé una cita en Nexora Labs para el ${appointment.scheduledAt.toLocaleString("es-CO")} (${serviceCategory}).`);
        // Número de WhatsApp del negocio — reemplazar por el real antes de desplegar.
        const whatsappUrl = `https://wa.me/573000000000?text=${message}`;
        return { success: true, whatsappUrl };
    }
    catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "No pudimos completar la reserva" };
    }
}
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
export async function updateAppointmentStatusAction(appointmentId, status) {
    const session = await auth();
    if (!session?.user ||
        !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
        throw new Error("No autorizado");
    }
    await updateAppointmentStatus(appointmentId, status);
    revalidatePath("/panel/calendario");
    return {
        success: true,
    };
}

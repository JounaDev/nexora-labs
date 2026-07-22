"use server";

import { z } from "zod";
import { prisma } from "@nexora/database/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import {
  getAvailableSlots,
  createAppointment,
  updateAppointmentStatus,
} from "@/lib/services/appointment.service";

import { sendAppointmentConfirmationEmail } from "@/lib/email";

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

type BookingResult =
  | {
      success: true;
      whatsappUrl: string;
    }
  | {
      success: false;
      error: string;
    };

const bookingSchema = z.object({
  name: z.string().min(3, "Nombre muy corto"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  serviceCategory: z.string(),
  scheduledAt: z.string(),
  notes: z.string().optional(),
});

export async function getAvailableSlotsAction(dateISO: string) {
  const slots = await getAvailableSlots(new Date(dateISO));
  return slots.map((slot) => slot.toISOString());
}

export async function createAppointmentAction(
  formData: FormData
): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  const {
    name,
    email,
    phone,
    serviceCategory,
    scheduledAt,
    notes,
  } = parsed.data;

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "CLIENT",
        clientProfile: {
          create: {},
        },
      },
    });
  }

  const clientProfile =
    await prisma.clientProfile.findUniqueOrThrow({
      where: {
        userId: user.id,
      },
    });

  try {
    const appointment = await createAppointment({
      clientId: clientProfile.id,
      serviceCategory: serviceCategory as never,
      scheduledAt: new Date(scheduledAt),
      notes,
    });

    await sendAppointmentConfirmationEmail({
      to: email,
      name,
      scheduledAt: appointment.scheduledAt,
    });

    const message = encodeURIComponent(
      `Hola, soy ${name}. Reservé una cita en Nexora Labs para el ${appointment.scheduledAt.toLocaleString(
        "es-CO"
      )} (${serviceCategory}).`
    );

    const whatsappUrl = `https://wa.me/573026565767?text=${message}`;

    return {
      success: true,
      whatsappUrl,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "No pudimos completar la reserva",
    };
  }
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AppointmentStatus
) {
  const session = await auth();

  if (
    !session?.user ||
    !["ADMIN", "TECHNICIAN"].includes(session.user.role)
  ) {
    throw new Error("No autorizado");
  }

  await updateAppointmentStatus(appointmentId, status);

  revalidatePath("/panel/calendario");

  return {
    success: true,
  };
}
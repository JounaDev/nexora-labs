// apps/web/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAppointmentConfirmationEmail(params: {
  to: string;
  name: string;
  scheduledAt: Date;
}) {
  const { to, name, scheduledAt } = params;

  const { error } = await resend.emails.send({
    from: "Nexora Labs <onboarding@resend.dev>", // Cambia esto por tu dominio cuando lo verifiques
    to,
    subject: "Confirmación de tu cita — Nexora Labs",
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>Hola ${name},</h2>
        <p>
          Tu cita en Nexora Labs quedó confirmada para el
          <strong>${scheduledAt.toLocaleString("es-CO")}</strong>.
        </p>
        <p>
          Si necesitas cambiarla, responde este correo o escríbenos por WhatsApp.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
// apps/web/lib/email.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendAppointmentConfirmationEmail(params) {
    const { to, name, scheduledAt } = params;
    await resend.emails.send({
        from: "iospna24000@gmail.com",
        to,
        subject: "Confirmación de tu cita — Nexora Labs",
        html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>Hola ${name},</h2>
        <p>Tu cita en Nexora Labs quedó confirmada para el <strong>${scheduledAt.toLocaleString("es-CO")}</strong>.</p>
        <p>Si necesitas cambiarla, responde este correo o escríbenos por WhatsApp.</p>
      </div>
    `,
    });
}

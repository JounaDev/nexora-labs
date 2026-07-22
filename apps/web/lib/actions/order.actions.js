// apps/web/lib/actions/order.actions.ts
"use server";
import { z } from "zod";
import { prisma } from "@nexora/database/client";
import { generateWompiCheckoutUrl } from "@/lib/wompi";
const cartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
});
const checkoutSchema = z.object({
    email: z.string().email("Correo inválido"),
    name: z.string().min(2, "Nombre muy corto"),
    items: z.array(cartItemSchema).min(1, "El carrito está vacío"),
});
export async function createOrderAndGetWompiUrlAction(input) {
    const parsed = checkoutSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    const { email, name, items } = parsed.data;
    // Mismo patrón de "cliente ligero" que reservas y tickets: si el correo
    // no existe, se crea sin contraseña — puede activarla luego con el
    // magic link de Fase 4.
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({ data: { name, email, role: "CLIENT", clientProfile: { create: {} } } });
    }
    const clientProfile = await prisma.clientProfile.findUniqueOrThrow({ where: { userId: user.id } });
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await prisma.order.create({
        data: {
            clientId: clientProfile.id,
            status: "PENDING",
            total,
            items: { create: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.price })) },
        },
    });
    const baseUrl = process.env.WEB_APP_URL ?? "http://localhost:3000";
    const checkoutUrl = generateWompiCheckoutUrl({
        amountInCents: Math.round(total * 100),
        reference: order.id,
        redirectUrl: `${baseUrl}/tienda/confirmacion?order=${order.id}`,
    });
    if (!checkoutUrl) {
        return { success: false, error: "El pago en línea no está configurado todavía. Usa el checkout por WhatsApp mientras tanto." };
    }
    return { success: true, checkoutUrl };
}

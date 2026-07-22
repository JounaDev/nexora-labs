// apps/web/lib/actions/auth.actions.ts
"use server";
import { prisma } from "@nexora/database/client";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validators/auth";
import { signIn } from "@/auth";
export async function signInWithGoogle() {
    await signIn("google", {
        redirectTo: "/mi-cuenta",
    });
}
export async function registerClient(formData) {
    const raw = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }
    const { name, email, phone, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { success: false, error: "Ya existe una cuenta con ese correo" };
    }
    const passwordHash = await hashPassword(password);
    // Se crea el User y su ClientProfile en una sola transacción implícita
    // (nested write de Prisma) — nunca queda un User "huérfano" sin perfil.
    await prisma.user.create({
        data: {
            name,
            email,
            phone,
            passwordHash,
            role: "CLIENT",
            clientProfile: { create: {} },
        },
    });
    return { success: true };
}

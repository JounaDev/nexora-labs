// apps/web/lib/actions/user.actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@nexora/database/client";
import { auth } from "@/auth";
export async function updateUserRoleAction(userId, role) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return { success: false, error: "No autorizado" };
    }
    // Evita que un admin se quite el rol a sí mismo por accidente y se quede
    // sin acceso al panel — si de verdad quieres hacerlo, que lo haga otro admin.
    if (userId === session.user.id) {
        return { success: false, error: "No puedes cambiar tu propio rol desde acá" };
    }
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/panel/usuarios");
    return { success: true };
}

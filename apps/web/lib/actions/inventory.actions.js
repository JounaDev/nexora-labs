// apps/web/lib/actions/inventory.actions.ts
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@nexora/database/client";
const itemSchema = z.object({
    sku: z.string().min(2),
    name: z.string().min(2),
    category: z.string().min(2),
    quantity: z.coerce.number().int().min(0),
    minStock: z.coerce.number().int().min(0),
    unitCost: z.coerce.number().min(0),
    unitPrice: z.coerce.number().min(0),
});
export async function createInventoryItemAction(formData) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
        return { success: false, error: "No autorizado" };
    }
    const parsed = itemSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success)
        return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    await prisma.inventoryItem.create({ data: parsed.data });
    revalidatePath("/panel/inventario");
    return { success: true };
}
// Ajuste rápido de stock (+1 / -1 desde la lista) — separado del form completo
// porque es la acción que más se va a usar en el día a día.
export async function adjustStockAction(itemId, delta) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
        return { success: false, error: "No autorizado" };
    }
    const item = await prisma.inventoryItem.findUniqueOrThrow({ where: { id: itemId } });
    const newQuantity = Math.max(0, item.quantity + delta);
    await prisma.inventoryItem.update({ where: { id: itemId }, data: { quantity: newQuantity } });
    revalidatePath("/panel/inventario");
    return { success: true };
}

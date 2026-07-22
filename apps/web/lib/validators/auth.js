// packages/validators/auth.ts (importado como @/lib/validators/auth en apps/web)
import { z } from "zod";
export const loginSchema = z.object({
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
});
export const registerSchema = z
    .object({
    name: z.string().min(2, "Nombre muy corto"),
    email: z.string().email("Correo inválido"),
    phone: z.string().optional(),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

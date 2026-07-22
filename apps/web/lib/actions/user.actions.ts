// apps/web/lib/actions/user.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@nexora/database/client";
import { auth } from "@/auth";


type Role = "ADMIN" | "TECHNICIAN" | "CLIENT";

export async function updateUserRoleAction(userId: string, role: Role) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "No autorizado",
    };
  }
console.log("🔥 updateUserRoleAction ejecutándose");
console.log("userId:", userId);
console.log("role:", role);
  if (userId === session.user.id) {
    return {
      success: false,
      error: "No puedes cambiar tu propio rol desde acá",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          role,
        },
      });
      const technicians = await tx.technicianProfile.findMany({
  include: {
    user: true,
  },
});

console.log(
  "Todos los técnicos:",
  technicians.map((t) => ({
    id: t.id,
    userId: t.userId,
    nombre: t.user.name,
  }))
);

      console.log("=================================");
      console.log("Usuario actualizado:", updatedUser);
      console.log("Role:", role);
      console.log("=================================");

      if (role === "TECHNICIAN") {
        console.log(
          "Creando TechnicianProfile para:",
          updatedUser.id
        );

        const exists = await tx.user.findUnique({
          where: {
            id: updatedUser.id,
          },
        });

        console.log("Existe usuario:", exists);

        await tx.technicianProfile.upsert({
          where: {
            userId: updatedUser.id,
          },
          update: {},
          create: {
            userId: updatedUser.id,
          },
        });

        console.log("TechnicianProfile creado correctamente");
      }
    });

    revalidatePath("/panel/usuarios");

    return {
      success: true,
    };
  } catch (err) {
    console.error("ERROR CAMBIANDO ROL");
    console.error(err);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }
}
// packages/database/seed.ts
//
// Ejecutar con: npm run db:seed (desde la raíz del monorepo)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash("admin1234", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@nexoralabs.co" },
        update: {},
        create: {
            name: "Admin Nexora",
            email: "admin@nexoralabs.co",
            passwordHash,
            role: "ADMIN",
        },
    });
    console.log(`Listo. Admin creado/actualizado: ${admin.email}`);
    console.log(`Contraseña temporal: admin1234 — cámbiala después de tu primer login.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());

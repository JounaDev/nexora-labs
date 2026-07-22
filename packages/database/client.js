// packages/database/client.ts
import { PrismaClient } from "@prisma/client";
// Evita agotar el pool de conexiones con hot-reload en desarrollo
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;

// apps/web/lib/password.ts
//
// bcryptjs (no bcrypt nativo) a propósito: no requiere compilación,
// evita romper builds en Vercel/Docker por bindings nativos.
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

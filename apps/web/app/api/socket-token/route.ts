// apps/web/app/api/socket-token/route.ts
//
// Auth.js firma su propia sesión como JWE (encriptado), no un JWT simple
// verificable con `jsonwebtoken` y un secreto compartido. En vez de tratar
// de decodificar eso desde el servicio de Socket.io, este endpoint valida
// la sesión con `auth()` (que sí sabe cómo leerla) y emite un JWT normal,
// de vida corta, firmado con un secreto propio — eso es lo que el servicio
// realtime verifica.
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: session.user.id, role: session.user.role },
    process.env.REALTIME_JWT_SECRET!,
    { expiresIn: "5m" }
  );

  return NextResponse.json({ token });
}

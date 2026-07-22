# Nexora Labs — Autenticación y Base de Datos
### Fase 4 de 9

---

## Decisiones clave

**Sesión JWT, no "database".** El provider de Credentials de Auth.js no es compatible con `session: { strategy: "database" }`. Como de todas formas necesitamos inyectar `role` en cada request para el middleware, JWT es la opción correcta aquí — no es una limitación, es lo que ya queríamos.

**Config partida en dos archivos.** `auth.config.ts` no importa Prisma ni bcrypt porque el middleware corre en el Edge Runtime, donde ninguno de los dos funciona. `auth.ts` tiene la configuración completa (Prisma adapter, providers con lógica de DB) y solo se ejecuta en rutas Node.js normales (Server Actions, Route Handlers, Server Components). Este split es el patrón estándar recomendado por Auth.js v5 para proyectos con middleware.

**bcryptjs en vez de bcrypt.** La versión nativa (`bcrypt`) requiere compilación C++; en Vercel/Docker eso es una fuente constante de builds rotos. `bcryptjs` es puro JS, un poco más lento, irrelevante a la escala de este negocio.

**Rutas reales de los route groups.** Los nombres entre paréntesis de Fase 1 (`(dashboard)`, `(portal)`) son solo organización de carpetas — no aparecen en la URL. Definí las rutas reales como `/panel/*` (dashboard admin/técnico) y `/mi-cuenta/*` (portal cliente) en el middleware. Si prefieres otros nombres de URL, es un cambio de una línea en `auth.config.ts`.

## Flujo de registro

`registerClient` (Server Action) valida con Zod, verifica que el correo no exista, hashea la contraseña, y crea `User` + `ClientProfile` en un solo *nested write* de Prisma — evita el caso en el que un usuario queda creado sin perfil por un error a mitad de camino.

Los roles `ADMIN` y `TECHNICIAN` **no se auto-asignan** desde ningún formulario público. Se crean vía seed inicial o desde el panel administrativo por un admin existente (esto se construye en Fase 5) — es una decisión de seguridad deliberada, no un descuido.

## Magic link

Usa el provider oficial `Resend` de Auth.js, que reutiliza la tabla `VerificationToken` ya definida en el `schema.prisma` de Fase 1 sin cambios. Sirve como alternativa de login sin contraseña, útil sobre todo para clientes que solo entran ocasionalmente a ver el estado de su reparación.

## Cómo probar localmente

```bash
npx auth secret          # genera AUTH_SECRET
npx prisma migrate dev   # aplica el schema de Fase 1
npx prisma db seed       # (Fase 5) crea el primer admin
npm run dev
```

## Archivos entregados

| Archivo | Ubicación real en el monorepo |
|---|---|
| `db-client.ts` | `packages/database/client.ts` |
| `auth.config.ts` | `apps/web/auth.config.ts` |
| `auth.ts` | `apps/web/auth.ts` |
| `middleware.ts` | `apps/web/middleware.ts` |
| `route.ts` | `apps/web/app/api/auth/[...nextauth]/route.ts` |
| `auth-validators.ts` | `packages/validators/auth.ts` |
| `password.ts` | `apps/web/lib/password.ts` |
| `auth.actions.ts` | `apps/web/lib/actions/auth.actions.ts` |
| `.env.example` | raíz del monorepo |

## Siguiente paso

Con login funcionando y roles en la sesión, la Fase 5 (Panel Administrativo) ya puede proteger `/panel` de verdad y empezar a leer/escribir sobre el schema de Fase 1: clientes, tickets, inventario.

# Nexora Labs — Monorepo

Plataforma de Nexora Labs: marketing + portal de cliente + panel administrativo + tienda, sobre Next.js 15, Prisma/PostgreSQL, Auth.js v5 y un servicio de tiempo real con Socket.io.

Este README es la Fase 10, digamos — no estaba en el plan original de 9 fases, pero es lo que faltaba para que todo lo construido corra en tu máquina.

---

## 0. Antes de instalar — dos cosas gratis que necesitas

1. **PostgreSQL.** La opción más rápida sin instalar nada localmente: crea una base gratis en [Neon](https://neon.tech) o [Supabase](https://supabase.com) y copia el `DATABASE_URL`.
2. **Node 20+** instalado.

Todo lo demás (Resend, Anthropic, WhatsApp) es opcional para arrancar — el sitio corre sin eso, solo esas features específicas no van a funcionar hasta que agregues las keys.

---

## 1. Instalar

```bash
npm install
```

Esto instala todo el monorepo (apps/web, apps/realtime, packages/*) de una — así están configurados los workspaces en el `package.json` raíz.

## 2. Variables de entorno

```bash
cp .env.example apps/web/.env
cp .env.example packages/database/.env
```

Next.js solo lee `.env` desde `apps/web/`, y el CLI de Prisma lee `.env` desde `packages/database/` (donde vive `schema.prisma`) — por eso se copia en los dos lugares. Completa como mínimo:

- `DATABASE_URL` (obligatorio)
- `AUTH_SECRET` — genera uno con `npx auth secret`
- El resto puede quedar vacío por ahora

## 3. Base de datos

```bash
npm run db:generate   # genera el cliente de Prisma
npm run db:migrate    # crea las tablas en tu base
npm run db:seed       # crea el primer usuario ADMIN
```

El seed crea `admin@nexoralabs.co` / `admin1234` — cámbiala apenas entres.

## 4. Correr todo

```bash
npm run dev
```

Turborepo levanta `apps/web` en `http://localhost:3000`. El servicio de chat (`apps/realtime`) **no** arranca con este comando — es un servicio aparte (ver sección 6).

Entra a `http://localhost:3000/login` con el admin del seed para llegar a `/panel`.

---

## 5. Qué funciona de una y qué necesita una key

| Feature | Funciona sin configurar nada más | Necesita |
|---|---|---|
| Marketing, login, registro, panel, portal, tienda | ✅ | — |
| Cambiar estado de tickets, inventario | ✅ | — |
| Reservas (crear cita) | ✅ | — |
| Email de confirmación de cita | ❌ | `RESEND_API_KEY` |
| Asistente IA | ❌ | `ANTHROPIC_API_KEY` |
| Chat en tiempo real | ❌ | Servicio `apps/realtime` corriendo + `REALTIME_JWT_SECRET` |

## 6. Levantar el servicio de chat (opcional para desarrollo)

```bash
cd apps/realtime
npm install
npm run dev
```

Necesita su propio `.env` con `REALTIME_JWT_SECRET` (el mismo valor que en `apps/web/.env`) y `WEB_APP_URL=http://localhost:3000`. En producción este servicio va en Railway/Render/Docker, nunca en Vercel — ver `docs/RESERVAS_CHAT_IA.md` para el porqué.

---

## 7. Estructura

```
nexora-labs/
├── apps/
│   ├── web/            # Next.js 15 — todo el sitio
│   └── realtime/        # Socket.io — chat y push en vivo
├── packages/
│   ├── database/         # schema.prisma + Prisma client
│   └── ui/                # design system (tokens + componentes)
└── docs/
    ├── ARCHITECTURE.md, DESIGN_SYSTEM.md, AUTH.md, PANEL.md,
    │   PORTAL.md, SEGUIMIENTO.md, RESERVAS_CHAT_IA.md, ECOMMERCE.md
    │   — un documento por cada una de las 9 fases originales
    └── previews/         # los HTML interactivos que revisamos fase a fase
```

## 8. Lo que todavía falta (ya lo sabías, queda documentado acá también)

- Páginas de menú sin construir: `/panel/clientes`, `/panel/facturacion`, `/panel/usuarios`, `/panel/reportes`, `/panel/calendario`, `/mi-cuenta/facturas` — 404 hasta que se construyan, mismo patrón que las demás.
- `@@unique([locationId, scheduledAt])` en `Appointment` (schema) para cerrar del todo la ventana de doble reserva.
- Port de la landing de Three.js vanilla (`docs/previews/landing.html`) a componentes reales de React Three Fiber — la homepage actual (`app/(marketing)/page.tsx`) usa una versión sin el objeto 3D.
- SEO (metadata por página, sitemap, robots.txt).
- Despliegue real (Vercel + Railway/Render + Neon/Supabase).

## 9. Una nota honesta sobre esta entrega

No pude correr `npm install` real ni `next build` en el entorno donde armé esto — no tiene acceso a instalar paquetes de npm más allá de unos pocos permitidos. Lo que sí hice: valider que los 60+ archivos quedaran en la ruta exacta que Next.js espera, que cada `package.json`/`tsconfig.json` fuera JSON válido, y un chequeo de sintaxis de TypeScript sobre los ~50 archivos `.ts`/`.tsx` del proyecto (sin resolver dependencias externas) que no encontró errores reales. Es una validación seria, pero no reemplaza un `npm install && npm run dev` real en tu máquina — si algo falla al levantarlo, dime el error exacto y lo resolvemos.

# Nexora Labs — Arquitectura del Sistema
### Fase 1 de 9 · Documento técnico de referencia

---

## 1. Visión general

Nexora Labs no es una landing page: es una plataforma multi-tenant potencial (multi-sede, multi-técnico) que combina:

- **Marketing site** (público, SEO-first, cinematográfico)
- **Portal del cliente** (seguimiento de reparaciones, facturas, historial)
- **Dashboard administrativo** (operación completa del negocio)
- **Motor de reservas + chat en tiempo real**
- **Base para e-commerce/POS/CRM/ERP futuro**

El diseño de la arquitectura de Fase 1 está pensado para que las fases 4–9 sean *extensiones*, no reescrituras.

---

## 2. Stack y justificación

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC reduce JS en cliente, Server Actions eliminan boilerplate de API para mutaciones simples, SEO nativo |
| UI | React 19 + TypeScript + TailwindCSS + shadcn/ui | Velocidad de desarrollo sin sacrificar control del diseño |
| Animación | Framer Motion + GSAP + Lenis | Motion para micro-interacciones declarativas, GSAP para timelines complejos (hero, scroll), Lenis para scroll suave |
| 3D | React Three Fiber + Three.js | Integración declarativa de R3F con el árbol de React |
| ORM/DB | Prisma + PostgreSQL | Tipado end-to-end, migraciones versionadas, buen soporte de relaciones complejas (necesarias aquí) |
| Auth | Auth.js (NextAuth v5) | Soporte nativo de roles vía JWT callbacks, credenciales + magic link |
| Validación | Zod (compartido cliente/servidor) | Un solo esquema de validación para formularios y Server Actions |
| Data fetching cliente | TanStack Query | Solo donde hay estado en tiempo real (chat, tracking) — el resto va por RSC |
| Formularios | React Hook Form + Zod resolver | — |
| Archivos | UploadThing (fotos de reparación) + Cloudinary (transformación/CDN) | — |
| Email | Resend | Deliverability alta, buena DX con React Email |
| Tiempo real | Socket.io (servicio Node separado) | Ver sección 6 — decisión importante |
| Infra | Turborepo + Docker | Monorepo cacheable, builds incrementales |

---

## 3. Estructura del monorepo (Turborepo)

```
nexora-labs/
├── apps/
│   ├── web/                    # Next.js 15 — marketing + admin + portal (route groups)
│   │   ├── app/
│   │   │   ├── (marketing)/    # Landing, servicios, sobre nosotros — público, SSG/ISR
│   │   │   ├── (auth)/         # Login, registro, recuperación
│   │   │   ├── (portal)/       # Cliente autenticado: seguimiento, facturas, chat
│   │   │   ├── (dashboard)/    # Admin/técnico: protegido por middleware de rol
│   │   │   └── api/            # Route handlers (webhooks, uploadthing, etc.)
│   │   ├── components/
│   │   ├── lib/
│   │   └── middleware.ts       # Enforce de roles por ruta
│   └── realtime/                # Servicio Node + Socket.io independiente (chat, tracking live)
├── packages/
│   ├── database/                # schema.prisma + Prisma client singleton
│   ├── ui/                      # Design system compartido (shadcn/ui + componentes propios)
│   ├── config/                  # eslint, tsconfig, tailwind config compartidos
│   ├── emails/                  # Templates React Email
│   └── validators/              # Esquemas Zod compartidos (ticket, reserva, etc.)
├── turbo.json
└── package.json
```

**Decisión clave:** una sola app Next.js con *route groups* para marketing/portal/dashboard, en vez de apps separadas. Para el tamaño actual del negocio, separar en 3 apps añade complejidad de despliegue sin beneficio real. Si en el futuro el dashboard necesita escalar de forma independiente (ej. múltiples sedes con alta concurrencia), se extrae a `apps/dashboard` sin tocar el dominio (`packages/database`, `packages/validators` ya están desacoplados).

---

## 4. Capas de la aplicación

```
Presentación (app/**)         → Server Components por defecto, Client Components solo donde hay interactividad
        ↓
Server Actions / Route Handlers → Validan con Zod, llaman a la capa de dominio
        ↓
Capa de dominio (lib/services/*) → Lógica de negocio pura (ej. calcularCostoReparacion, generarCodigoTicket)
        ↓
Capa de datos (packages/database) → Prisma client, sin lógica de negocio
```

Regla: los componentes de UI nunca llaman a Prisma directamente. Todo pasa por `services/`, lo que permite testear la lógica sin levantar la base de datos y reutilizarla entre Server Actions y el servicio de tiempo real.

---

## 5. Autenticación y roles

- Auth.js con estrategia de credenciales + magic link por email.
- Tres roles: `ADMIN`, `TECHNICIAN`, `CLIENT` (ver enum `Role` en el schema).
- El rol se inyecta en el JWT vía callback `jwt()` y se expone en la sesión.
- `middleware.ts` protege `(dashboard)` exigiendo `ADMIN` o `TECHNICIAN`, y `(portal)` exigiendo sesión válida con rol `CLIENT` (o superior, para que un admin pueda inspeccionar el portal de un cliente si es necesario).
- Preparado para roles adicionales futuros (`MANAGER` por sede) sin cambios estructurales — solo se añade al enum y se ajustan las reglas del middleware.

---

## 6. Tiempo real: chat y seguimiento en vivo

Este es el punto donde el stack que definiste (Socket.io) tiene una fricción real con Vercel: **Vercel no soporta conexiones WebSocket persistentes** en su runtime serverless estándar.

**Decisión recomendada:** `apps/realtime` es un servicio Node.js + Socket.io independiente, desplegado en un contenedor persistente (Railway, Render o un VPS con Docker) — no en Vercel. La app Next.js se conecta a él como cliente Socket.io desde el navegador, y se comunican eventos de servidor a servidor (ej. cuando un técnico cambia el estado de un ticket vía Server Action) a través de una llamada HTTP interna autenticada al servicio realtime, que emite el evento a los sockets conectados.

Alternativa más simple para arrancar (si prefieres evitar mantener un segundo servicio): reemplazar Socket.io por **Pusher** o **Ably** (managed, funcionan bien con Vercel, API similar). Lo dejo como decisión abierta — el schema y la capa de dominio no cambian en ningún caso, solo cambia el adaptador de eventos.

---

## 7. Pagos y facturación

El documento no especifica pasarela de pago. Dos caminos según el mercado:

- **Wompi** — pasarela colombiana, PSE/tarjeta local. Dado que ya la integraste en el proyecto Verlaire, la curva de aprendizaje es cero y probablemente sea la opción más práctica para clientes en Bogotá.
- **Stripe** — si en el futuro hay clientes internacionales o venta de hardware con envíos fuera de Colombia.

El schema modela `Payment.method` como enum extensible, así que se puede soportar ambas sin fricción.

---

## 8. Notificaciones

- **Email** vía Resend (confirmaciones de reserva, cambios de estado de ticket, facturas).
- **WhatsApp**: vía WhatsApp Business API (Meta) o un proveedor como Twilio — se define en Fase 8 junto con el motor de reservas.

---

## 9. Convenciones de código

- **Atomic Design** en `packages/ui`: `atoms/` (Button, Input) → `molecules/` (RepairStatusBadge) → `organisms/` (RepairTimeline).
- **SOLID** aplicado principalmente en `lib/services/*`: cada servicio tiene una responsabilidad (ej. `ticket.service.ts` no sabe de email; `notification.service.ts` sí).
- Nada de lógica de negocio en componentes de UI ni en route handlers — solo orquestación.
- ESLint + Prettier compartidos desde `packages/config`, mismos en todo el monorepo.

---

## 10. Cómo el modelo ya contempla el roadmap futuro

| Necesidad futura | Cómo ya está previsto |
|---|---|
| Múltiples sedes | `Location` como entidad propia, referenciada desde `TechnicianProfile`, `RepairTicket`, `InventoryItem`, `Appointment` |
| POS / múltiples técnicos | `RepairTicket.technicianId` + `TechnicianProfile` ya desacoplados de `User` |
| E-commerce | `Product`, `Order`, `OrderItem` definidos desde ahora (vacíos de datos, listos para activarse en Fase 9) |
| ERP/CRM | `AuditLog` y `Notification` genéricos permiten construir reportería y automatizaciones sin nuevas tablas base |
| App móvil | Como todo pasa por Server Actions + Route Handlers con Zod, exponer una API REST/tRPC para móvil es agregar una capa, no reescribir dominio |

---

## 11. Siguiente paso

El archivo `schema.prisma` adjunto es el modelo de datos completo que soporta las 9 fases. Con esto como base, la Fase 2 (Design System) puede construirse sin dependencias del backend.

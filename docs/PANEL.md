# Nexora Labs — Panel Administrativo
### Fase 5 de 9

---

## Alcance de esta entrega

El brief original lista 14 sub-secciones (Clientes, Reparaciones, Inventario, Facturación, Usuarios, Roles, Calendario, Ingresos, Gráficas, Reportes, Logs, Fotografías, Garantías, Historial). Construir las 14 completas de una sola vez habría significado código superficial en todas — preferí dejar **el shell y el patrón completamente resueltos** con una página real (Resumen) conectada de punta a punta a la base de datos, para que Clientes, Reparaciones, Inventario, etc. sean repeticiones mecánicas del mismo patrón, no once problemas nuevos.

Algunas sub-secciones del brief no son páginas propias sino que viven **dentro** de otra: Fotografías, Garantías e Historial aparecen en el detalle de un ticket de reparación, no en su propio ítem de menú — es donde un usuario real las esperaría encontrar.

## Decisión de diseño: restraint deliberado

La landing (Fase 3) es cinematográfica a propósito — es la primera impresión. El panel es una herramienta de trabajo que alguien va a mirar 40 veces al día: bajé el aurora a casi nada, quité el scan pulse de los elementos de datos (tablas, stats) y lo dejé solo donde todavía comunica algo (hover en tarjetas). Un dashboard con demasiado movimiento cansa — Linear y Vercel son la referencia correcta aquí, no la landing de Stripe.

## Qué está conectado de verdad

`app/panel/page.tsx` no tiene datos de mentira: las 4 métricas y la tabla de tickets recientes salen de consultas Prisma reales contra el `schema.prisma` de Fase 1 (ingresos vía `Payment.aggregate`, tickets activos filtrando por `status`, clientes nuevos vía relación anidada `clientProfile.user.createdAt`). `StatusBadge` es el mismo componente de Fase 2, ahora alimentado con datos reales del enum `RepairStatus`.

`Sidebar` filtra los ítems de navegación por `role` — Facturación, Reportes y Usuarios solo aparecen si el usuario es `ADMIN`. Un técnico ve un menú más corto, no un menú completo con candados visuales.

## Corrección menor sobre Fase 1

Los folders con paréntesis (`(dashboard)`) no generan segmento de URL en Next.js — como ya definimos que la ruta real es `/panel`, la carpeta correcta es simplemente `app/panel/`, sin route group envolvente. No cambia nada del diseño de Fase 1, solo la implementación literal de carpetas.

## Archivos entregados

| Archivo | Ubicación real |
|---|---|
| `panel-preview.html` | — (solo revisión visual) |
| `panel-layout.tsx` | `apps/web/app/panel/layout.tsx` |
| `sidebar.tsx` | `apps/web/components/dashboard/sidebar.tsx` |
| `topbar.tsx` | `apps/web/components/dashboard/topbar.tsx` |
| `panel-page.tsx` | `apps/web/app/panel/page.tsx` |

## Siguiente paso

Con el patrón (layout protegido → Server Component → Prisma → componentes de Fase 2) resuelto, puedo construir **Clientes**, **Reparaciones** o **Inventario** como páginas completas en cualquier momento — son ~20 minutos de trabajo cada una siguiendo el mismo molde. Dime cuál priorizamos, o seguimos con **Fase 6: Portal del Cliente**.

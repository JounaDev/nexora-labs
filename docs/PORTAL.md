# Nexora Labs — Portal del Cliente
### Fase 6 de 9

---

## La pieza central: seguimiento animado

El brief pide explícitamente que cada estado tenga animación. `RepairTimeline` es el componente que lo resuelve: una barra de progreso que se llena con gradiente morado→cyan hasta el estado actual, y el nodo activo late con el mismo anillo de pulso que ya establecimos como firma visual en Fase 2. `timeline-preview.html` te deja clickear entre los 6 estados para ver la animación en cada transición antes de que esto viva dentro de una página real.

## Seguridad: lo no negociable de un portal de cliente

La página de detalle (`reparaciones/[id]/page.tsx`) filtra por `clientId` **dentro de la misma query** a Prisma (`findFirst({ where: { id, clientId } })`), no después. La diferencia importa: si se trajera el ticket por id y se comparara el `clientId` en JavaScript después, un bug en esa comparación filtraría datos de otro cliente. Filtrando en la query, un id que no pertenece al cliente simplemente no existe para él — la base de datos nunca lo devuelve.

## Qué muestra la página de detalle

Exactamente lo que pedía el brief para el panel de cada cliente: Estado (timeline), Garantía, Factura, Fotos (attachments) e Historial (`RepairStatusHistory`) — todo salido de relaciones reales del `schema.prisma` de Fase 1, sin datos de ejemplo.

**Mensajes** queda como referencia visual ("el chat llega en la Fase 8") en vez de construir un chat que no puede funcionar todavía — Fase 8 es donde se resuelve tiempo real de verdad (recordarás la discusión de Socket.io vs Pusher/Ably de Fase 1). Construir un chat falso aquí solo para "completar la lista" habría sido trabajo desechable.

## Archivos entregados

| Archivo | Ubicación real |
|---|---|
| `timeline-preview.html` | — (solo revisión visual, interactivo) |
| `portal-layout.tsx` | `apps/web/app/mi-cuenta/layout.tsx` |
| `repair-timeline.tsx` | `apps/web/components/portal/repair-timeline.tsx` |
| `mi-cuenta-page.tsx` | `apps/web/app/mi-cuenta/page.tsx` |
| `reparacion-detalle.tsx` | `apps/web/app/mi-cuenta/reparaciones/[id]/page.tsx` |

## Siguiente paso

**Fase 7 (Sistema de seguimiento de reparaciones)** es, en rigor, la mitad que falta de esto: la vista del **técnico/admin** para *cambiar* el estado de un ticket — lo que aquí el cliente solo lee. Seguimos con esa cuando quieras.

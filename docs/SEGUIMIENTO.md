# Nexora Labs — Sistema de Seguimiento de Reparaciones
### Fase 7 de 9

---

Esta fase no necesita un preview visual nuevo — reutiliza el mismo `RepairTimeline` animado de Fase 6. Lo que se agrega acá es la mitad que faltaba: la capacidad de **cambiar** el estado, con las reglas de negocio que eso implica.

## La regla que importa: solo hacia adelante

Un ticket no puede "retroceder" de estado por un click accidental. `isValidTransition` en `ticket-flow.ts` solo permite avanzar en la secuencia (`RECEIVED → DIAGNOSIS → AWAITING_PARTS → IN_REPAIR → TESTING → COMPLETED → DELIVERED`) o cancelar desde cualquier punto activo. Una vez `DELIVERED` o `CANCELLED`, el ticket queda cerrado — reabrir uno sería una acción explícita y auditada aparte, no un botón más en la misma lista (fuera de alcance por ahora, lo señalo para cuando lo necesites).

Sí permite **saltar** pasos: si un repuesto no hace falta, un técnico puede ir directo de `DIAGNOSIS` a `IN_REPAIR` sin pasar por `AWAITING_PARTS`. La secuencia es una guía, no una cárcel.

## Por qué existe `ticket-flow.ts` separado de `ticket.service.ts`

Este es un detalle de arquitectura que vale la pena señalar porque es fácil pasarlo por alto y termina rompiendo el build: `status-changer.tsx` es un Client Component — corre en el navegador. Si importara `getNextValidStatuses` directo desde `ticket.service.ts`, arrastraría el cliente de Prisma (que no es para navegador) al bundle. Separé las reglas puras de transición (`ticket-flow.ts`, sin imports de servidor) de la lógica que sí toca la base de datos (`ticket.service.ts`). El componente cliente importa solo del primero.

## Qué pasa automáticamente al completar un ticket

`changeTicketStatus` no solo actualiza el `status` — dentro de la misma transacción de Prisma: registra la entrada en `RepairStatusHistory` (con quién hizo el cambio y su nota opcional) y, si el nuevo estado es `COMPLETED`, calcula y activa la garantía (`warrantyMonths` del ticket + fecha actual) automáticamente. Nadie tiene que acordarse de crear la garantía a mano ni puede olvidarlo.

## Sincronización con el portal del cliente

`changeTicketStatusAction` llama `revalidatePath` tanto en la vista del técnico como en `/mi-cuenta/reparaciones/[id]` — el cliente ve el nuevo estado la próxima vez que cargue o refresque esa página. No es push en tiempo real todavía (eso depende de la decisión de Socket.io/Pusher de Fase 1, que se implementa en Fase 8) — es consistencia de datos garantizada, que es lo que importa primero.

## Archivos entregados

| Archivo | Ubicación real |
|---|---|
| `ticket-flow.ts` | `apps/web/lib/ticket-flow.ts` |
| `ticket.service.ts` | `apps/web/lib/services/ticket.service.ts` |
| `ticket.actions.ts` | `apps/web/lib/actions/ticket.actions.ts` |
| `status-changer.tsx` | `apps/web/components/dashboard/status-changer.tsx` |
| `reparaciones-list.tsx` | `apps/web/app/panel/reparaciones/page.tsx` |
| `ticket-detalle-admin.tsx` | `apps/web/app/panel/reparaciones/[id]/page.tsx` |

## Siguiente paso

**Fase 8: Reservas, chat e IA.** Ahí sí se resuelve tiempo real de verdad (el chat que quedó pendiente en el portal) y el motor de reservas con calendario.

# Nexora Labs — Reservas, Chat e IA
### Fase 8 de 9

---

## Reservas

`getAvailableSlots` calcula horarios libres (8am–5pm, bloques de 1 hora) restando las citas ya confirmadas ese día. `createAppointment` vuelve a verificar el cupo dentro de una transacción antes de crear — reduce la ventana de doble reserva simultánea, pero no la elimina del todo sin un índice único en base de datos. **Recomendación para antes de producción:** agregar `@@unique([locationId, scheduledAt])` al modelo `Appointment` del schema de Fase 1.

La reserva es pública — no exige cuenta previa. Si el correo no existe, `createAppointmentAction` crea un `User` + `ClientProfile` "ligero" (sin contraseña) al vuelo; el cliente puede activarlo después con el magic link de Fase 4. Es el flujo correcto para un negocio donde la mayoría llega buscando un diagnóstico, no a registrarse.

**WhatsApp** usa un link `wa.me` con el mensaje pre-armado, no la API de Negocios de Meta — la misma decisión práctica que ya usaste en Verlaire y La Forneria. Funciona sin aprobación de Meta ni costos por mensaje; el límite es que no puedes automatizar respuestas desde el negocio, solo abrir la conversación. Si más adelante quieres respuestas automáticas de WhatsApp, ahí sí hace falta la API oficial (Twilio o Meta directo).

## Chat en tiempo real

Se implementó la opción que Fase 1 dejó como recomendación principal: `apps/realtime` es un servicio Socket.io independiente — no vive en Vercel, se despliega en Railway/Render/Docker corriendo indefinidamente.

**El punto más delicado, y por qué se resolvió así:** Auth.js firma la sesión como JWE encriptado, no como un JWT simple verificable con un secreto compartido. En vez de hacer que el servicio de Socket.io entienda el formato interno de Auth.js, `/api/socket-token` (que sí corre dentro de Next.js y sabe leer la sesión) emite un JWT normal de 5 minutos de vida, firmado con `REALTIME_JWT_SECRET`. El cliente pide ese token antes de conectar el socket; el servicio realtime solo necesita verificar un JWT estándar. Es la separación correcta de responsabilidades, no un atajo.

El servicio también expone `/internal/broadcast`, un endpoint HTTP interno para que `ticket.service.ts` (Fase 7) empuje actualizaciones en vivo cuando cambia el estado de un ticket — quedó preparado pero no conectado en este entregable; es una llamada `fetch` de una línea agregarlo cuando quieras.

**Nuevas variables de entorno** (sumar a `.env.example` de Fase 4):
```
REALTIME_JWT_SECRET=""
NEXT_PUBLIC_REALTIME_URL="http://localhost:4000"
WEB_APP_URL="http://localhost:3000"
```

## Asistente IA

Implementado exactamente como lo pediste: nunca da un diagnóstico definitivo, siempre termina recomendando agendar. `app/api/ai-assistant/route.ts` es el endpoint real de producción, usando el SDK de Anthropic server-side con tu `ANTHROPIC_API_KEY`.

**`ai-assistant-demo.html` no es una maqueta — llama a la API de Anthropic de verdad**, con el mismo system prompt del código de producción. Puedes escribirle "mi portátil no da imagen" ahora mismo y ver la respuesta real antes de que esto exista en el sitio.

## Cómo se conecta con lo ya construido

`ChatWidget` está listo para insertarse en `app/mi-cuenta/reparaciones/[id]/page.tsx` (Fase 6) y en `app/panel/reparaciones/[id]/page.tsx` (Fase 7) — ambos ya tienen la relación `conversation` disponible en el ticket. Falta solo pasar `conversationId` e `initialMessages` como props; no lo cableé automáticamente para no volver a tocar esos archivos sin que los revises primero.

## Archivos entregados

| Archivo | Ubicación real |
|---|---|
| `appointment.service.ts` | `apps/web/lib/services/appointment.service.ts` |
| `email.ts` | `apps/web/lib/email.ts` |
| `appointment.actions.ts` | `apps/web/lib/actions/appointment.actions.ts` |
| `booking-widget.tsx` | `apps/web/components/marketing/booking-widget.tsx` |
| `socket-token-route.ts` | `apps/web/app/api/socket-token/route.ts` |
| `realtime-server.ts` | `apps/realtime/server.ts` |
| `realtime-package.json` | `apps/realtime/package.json` |
| `chat-widget.tsx` | `apps/web/components/shared/chat-widget.tsx` |
| `ai-assistant-route.ts` | `apps/web/app/api/ai-assistant/route.ts` |
| `ai-assistant-widget.tsx` | `apps/web/components/marketing/ai-assistant-widget.tsx` |
| `ai-assistant-demo.html` | — (demo funcional, no se despliega) |

## Siguiente paso

**Fase 9: E-commerce e inventario** — la última.

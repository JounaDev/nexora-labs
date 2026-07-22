// apps/web/lib/ticket-flow.ts
//
// Separado de ticket.service.ts a propósito: este archivo no importa Prisma,
// así que status-changer.tsx (Client Component) puede usar getNextValidStatuses
// sin arrastrar el cliente de Prisma al bundle del navegador.

export const FLOW = ["RECEIVED", "DIAGNOSIS", "AWAITING_PARTS", "IN_REPAIR", "TESTING", "COMPLETED", "DELIVERED"] as const;
export const TERMINAL = ["DELIVERED", "CANCELLED"];

export type FlowStatus = (typeof FLOW)[number] | "CANCELLED";

export function isValidTransition(current: string, next: string): boolean {
  if (TERMINAL.includes(current)) return false;
  if (next === "CANCELLED") return true;

  const currentIdx = FLOW.indexOf(current as (typeof FLOW)[number]);
  const nextIdx = FLOW.indexOf(next as (typeof FLOW)[number]);
  if (currentIdx === -1 || nextIdx === -1) return false;

  return nextIdx > currentIdx;
}

export function getNextValidStatuses(current: string): FlowStatus[] {
  if (TERMINAL.includes(current)) return [];
  const currentIdx = FLOW.indexOf(current as (typeof FLOW)[number]);
  const forward = FLOW.slice(currentIdx + 1);
  return [...forward, "CANCELLED"];
}

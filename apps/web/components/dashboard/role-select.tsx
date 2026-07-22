// apps/web/components/dashboard/role-select.tsx
"use client";

import { useTransition } from "react";
import { updateUserRoleAction } from "@/lib/actions/user.actions";

export function RoleSelect({ userId, currentRole, isSelf }: { userId: string; currentRole: string; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="font-mono text-xs text-text-muted">{currentRole} (tú)</span>;
  }

  return (
    <select
      defaultValue={currentRole}
      disabled={isPending}
     onChange={(e) =>
  startTransition(async () => {
    await updateUserRoleAction(userId, e.target.value as never);
  })
}
      className="rounded-lg border border-border/10 bg-surface/5 px-2 py-1 text-xs disabled:opacity-40"
    >
      <option value="CLIENT">CLIENT</option>
      <option value="TECHNICIAN">TECHNICIAN</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}

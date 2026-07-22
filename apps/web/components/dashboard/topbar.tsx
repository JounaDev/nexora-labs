// apps/web/components/dashboard/topbar.tsx
"use client";

import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@nexora/ui/components";
import { UserMenu } from "./user-menu";

interface TopbarUser {
  name?: string | null;
  role: "ADMIN" | "TECHNICIAN" | "CLIENT";
}

export function Topbar({ user }: { user: TopbarUser }) {
  const displayName = user.name ?? "Usuario";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-border/10 px-9 py-4">
      <div className="glass flex w-72 items-center gap-2 rounded-lg px-3.5 py-2">
        <Search size={15} className="text-text-muted" />

        <input
          type="search"
          placeholder="Buscar ticket, cliente..."
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="glass flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-text">
          <Bell size={16} />
        </button>

        <ThemeToggle />

        <UserMenu
          name={displayName}
          role={user.role}
        />
      </div>
    </header>
  );
}
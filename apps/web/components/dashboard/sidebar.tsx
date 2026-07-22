// apps/web/components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Users, Wrench, Package, Receipt, BarChart3, ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

type Role = "ADMIN" | "TECHNICIAN" | "CLIENT";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
  group: "General" | "Operación" | "Administración";
}

const NAV_ITEMS: NavItem[] = [
  { label: "Resumen", href: "/panel", icon: LayoutDashboard, roles: ["ADMIN", "TECHNICIAN"], group: "General" },
  { label: "Calendario", href: "/panel/calendario", icon: CalendarDays, roles: ["ADMIN", "TECHNICIAN"], group: "General" },
  { label: "Clientes", href: "/panel/clientes", icon: Users, roles: ["ADMIN", "TECHNICIAN"], group: "Operación" },
  { label: "Reparaciones", href: "/panel/reparaciones", icon: Wrench, roles: ["ADMIN", "TECHNICIAN"], group: "Operación" },
  { label: "Inventario", href: "/panel/inventario", icon: Package, roles: ["ADMIN", "TECHNICIAN"], group: "Operación" },
  { label: "Facturación", href: "/panel/facturacion", icon: Receipt, roles: ["ADMIN"], group: "Operación" },
  { label: "Reportes", href: "/panel/reportes", icon: BarChart3, roles: ["ADMIN"], group: "Administración" },
  { label: "Usuarios", href: "/panel/usuarios", icon: ShieldCheck, roles: ["ADMIN"], group: "Administración" },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const groups = ["General", "Operación", "Administración"] as const;

  return (
    <aside className="glass flex flex-col gap-10 border-r border-border/10 px-5 py-7">
      <div className="px-2 font-display text-sm font-black">
        NEXORA <span className="text-cyan">LABS</span>
      </div>

      <nav className="flex flex-col gap-1">
        {groups.map((group) => {
          const groupItems = items.filter((i) => i.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group}>
              <p className="px-2 pb-1 pt-4 font-mono text-[0.65rem] tracking-widest text-text-muted">
                {group.toUpperCase()}
              </p>
              {groupItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-md px-2.5 py-2.5 text-sm transition-colors",
                      isActive ? "bg-cyan/10 text-cyan" : "text-text-muted hover:bg-surface/5 hover:text-text"
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

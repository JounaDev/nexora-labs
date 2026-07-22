// apps/web/components/marketing/nav.tsx
"use client";

import Link from "next/link";
import { ThemeToggle } from "@nexora/ui/components";

export function Nav() {
  return (
    <nav className="glass fixed inset-x-0 top-0 z-40 flex items-center justify-between border-x-0 border-t-0 px-6 py-4 sm:px-10">
      <Link href="/" className="font-display text-sm font-black">
        NEXORA <span className="text-cyan">LABS</span>
      </Link>

      <div className="hidden gap-8 text-sm text-text-muted sm:flex">
        <Link href="/#servicios" className="hover:text-text">Servicios</Link>
        <Link href="/#desarrollo" className="hover:text-text">Desarrollo</Link>
        <Link href="/tienda" className="hover:text-text">Tienda</Link>
        <Link href="#cv">Sobre mí</Link>
       <Link href="/3d">3D Modelos</Link> 
        <Link href="/seguimiento">Pedidos</Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/reservar" className="rounded-full bg-text px-4 py-2 text-xs font-medium text-bg">
          Solicitar reparación
        </Link>
      </div>
    </nav>
  );
}

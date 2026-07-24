"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#desarrollo", label: "Desarrollo" },
  { href: "/tienda", label: "Tienda" },
  { href: "#cv", label: "Sobre mí" },
  { href: "/3d", label: "3D Modelos" },
  { href: "/seguimiento", label: "Pedidos" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {/* Fondo oscuro */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Menú lateral */}
      <aside
      className={`fixed left-0 top-0 z-50 h-screen w-72
bg-zinc-950/95
backdrop-blur-xl
border-r border-white/10
shadow-2xl
transition-transform duration-300
${open ? "translate-x-0" : "-translate-x-full"}{
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <span className="font-bold">
            NEXORA <span className="text-cyan-400">LABS</span>
          </span>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 transition hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="mt-6 rounded-xl bg-cyan-500 px-4 py-3 text-center font-semibold text-white hover:bg-cyan-400"
          >
            Solicitar reparación
          </Link>
        </nav>
      </aside>
    </>
  );
}
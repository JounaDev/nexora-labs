"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="rounded-xl p-2 transition hover:bg-white/10 md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72
        bg-zinc-950
        border-r border-white/10
        shadow-2xl
        transition-transform duration-300 ease-out
        rounded-r-3xl
        md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="font-black tracking-wide">
            NEXORA <span className="text-cyan-400">LABS</span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 transition hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 p-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/reservar"
            onClick={() => setOpen(false)}
            className="mt-6 rounded-xl bg-cyan-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-cyan-400"
          >
            Solicitar reparación
          </Link>
        </nav>
      </aside>
    </>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  name: string;
  role: string;
}

export function UserMenu({ name, role }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="glass flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-white/10"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple to-cyan font-display text-xs font-bold text-black">
          {initials}
        </div>

        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 p-3">
            <p className="font-semibold text-white">{name}</p>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              {role}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
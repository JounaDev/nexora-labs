// apps/web/app/registro/page.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerClient } from "@/lib/actions/auth.actions";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await registerClient(formData);
      if (result.success === false) {
  setError(result.error);
  return;
}
      router.push("/login");
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="glass w-full max-w-sm rounded-2xl p-8">
        <Link href="/" className="mb-8 block font-display text-sm font-black">
          NEXORA <span className="text-cyan">LABS</span>
        </Link>

        <form action={handleSubmit} className="flex flex-col gap-3">
          <input name="name" placeholder="Nombre completo" required className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm" />
          <input name="email" type="email" placeholder="Correo" required className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm" />
          <input name="phone" placeholder="Teléfono (opcional)" className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm" />
          <input name="password" type="password" placeholder="Contraseña" required className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm" />
          <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" required className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm" />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" disabled={isPending} className="rounded-full bg-text py-3 font-display text-sm font-medium text-bg disabled:opacity-50">
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          ¿Ya tienes cuenta? <Link href="/login" className="text-cyan">Entra aquí</Link>
        </p>
      </div>
    </div>
  );
}

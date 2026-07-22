
// apps/web/app/mi-cuenta/layout.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@nexora/database/client";
import { ThemeToggle } from "@nexora/ui/components";
import { signOut } from "@/auth";
import { LogOut } from "lucide-react";



export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Un ADMIN puede entrar a inspeccionar (permitido por el middleware),
  // pero el portal solo tiene sentido con un ClientProfile de referencia.
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!clientProfile && session.user.role === "CLIENT") {
    // No debería pasar nunca (se crea en el registro), pero si pasa, no rompemos la app.
    redirect("/login?error=perfil_incompleto");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-10 flex items-center justify-between">
        <Link href="/mi-cuenta" className="font-display text-sm font-black">
          NEXORA <span className="text-cyan">LABS</span>
        </Link>
       <div className="flex items-center gap-4 text-sm text-text-muted">
  <Link href="/mi-cuenta">
    Mis reparaciones
  </Link>

  <Link href="/mi-cuenta/facturas">
    Facturas
  </Link>

  <ThemeToggle />

  <form
    action={async () => {
      "use server";

      await signOut({
        redirectTo: "/login",
      });
    }}
  >
    <button
      type="submit"
      className="
        flex items-center gap-2
        rounded-xl
        px-3 py-2
        text-red-400
        transition
        hover:bg-red-500/10
      "
    >
      <LogOut size={16} />
      Salir
    </button>
  </form>
</div>
      </header>
      {children}
    </div>
  );
}

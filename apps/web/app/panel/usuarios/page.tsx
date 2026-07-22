// apps/web/app/panel/usuarios/page.tsx
import { auth } from "@/auth";
import { prisma } from "@nexora/database/client";
import { GlassCard } from "@nexora/ui/components";
import { RoleSelect } from "@/components/dashboard/role-select";

export default async function UsuariosPage() {
  const session = await auth();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-black">Usuarios</h1>
      <p className="mb-6 text-sm text-text-muted">{users.length} registrados</p>

      <GlassCard scan={false} className="!p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/10 text-left font-mono text-[0.65rem] tracking-wide text-text-muted">
              <th className="px-5 py-3">NOMBRE</th>
              <th className="px-5 py-3">CORREO</th>
              <th className="px-5 py-3">ROL</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/5">
                <td className="px-5 py-3">{u.name}</td>
                <td className="px-5 py-3 text-text-muted">{u.email}</td>
                <td className="px-5 py-3">
                  <RoleSelect userId={u.id} currentRole={u.role} isSelf={u.id === session?.user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}

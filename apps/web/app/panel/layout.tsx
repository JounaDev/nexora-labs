import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log("====================================");
  console.log("SESSION PANEL:");
  console.log(JSON.stringify(session, null, 2));
  console.log("====================================");

  if (!session?.user) {
    console.log("NO HAY SESIÓN");
    redirect("/login");
  }
  
   if (!["ADMIN", "TECHNICIAN"].includes(session.user.role)) {
     redirect("/login");
   }

  console.log("ENTRANDO AL PANEL");

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr]">
      <Sidebar role={session.user.role} />
      <div className="flex flex-col">
        <Topbar user={session.user} />
        <main className="flex-1 px-9 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
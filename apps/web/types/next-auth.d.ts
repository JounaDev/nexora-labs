// apps/web/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

type Role = "ADMIN" | "TECHNICIAN" | "CLIENT";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

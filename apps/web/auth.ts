// apps/web/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@nexora/database/client";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validators/auth";
import authConfig from "./auth.config";


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),

  // Credentials requiere JWT
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Correo",
          type: "email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },

      async authorize(rawCredentials) {
         console.log("AUTHORIZE EJECUTÁNDOSE");
  console.log(rawCredentials);
        const parsed = loginSchema.safeParse(rawCredentials);

        if (!parsed.success) {
   //       console.log("Schema inválido");
          return null;
        }

        const { email, password } = parsed.data;

     //   console.log("Buscando:", email);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log("Usuario encontrado:", user);

        if (!user?.passwordHash) {
       //   console.log("No tiene passwordHash");
          return null;
        }

        const isValid = await verifyPassword(
          password,
          user.passwordHash
        );

      //  console.log("Contraseña válida:", isValid);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,

      // Permite vincular una cuenta existente con el mismo correo
      allowDangerousEmailAccountLinking: true,
    }),

    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Nexora Labs <no-reply@nexoralabs.co>",
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    /**
     * Se ejecuta después del login.
     * Aquí garantizamos que existan los perfiles.
     */
 async signIn({ user, account, profile }) {
  try {
/*   console.log("========== SIGN IN ==========");
    console.log("USER:", user);
    console.log("ACCOUNT:", account);
    console.log("PROFILE:", profile);*/

    if (!user.email) {
      console.log("No llegó email");
      return false;
    }

  /*  const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });*/

   // console.log("USUARIOS EN BD:", allUsers);

    const dbUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

   // console.log("DB USER:", dbUser);

    if (!dbUser) {
      console.log("No existe usuario todavía");
      return true;
    }

    if (dbUser.role === "CLIENT") {
      await prisma.clientProfile.upsert({
        where: {
          userId: dbUser.id,
        },
        update: {},
        create: {
          userId: dbUser.id,
        },
      });
    }

    if (dbUser.role === "TECHNICIAN") {
      await prisma.technicianProfile.upsert({
        where: {
          userId: dbUser.id,
        },
        update: {},
        create: {
          userId: dbUser.id,
        },
      });
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }


    },

    /**
     * JWT
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

     if (token.email) {
  const dbUser = await prisma.user.findUnique({
    where: {
      email: token.email,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (dbUser) {
    token.id = dbUser.id;
    token.role = dbUser.role;

    if (dbUser.role === "CLIENT") {
      await prisma.clientProfile.upsert({
        where: {
          userId: dbUser.id,
        },
        update: {},
        create: {
          userId: dbUser.id,
        },
      });
    }

    if (dbUser.role === "TECHNICIAN") {
      await prisma.technicianProfile.upsert({
        where: {
          userId: dbUser.id,
        },
        update: {},
        create: {
          userId: dbUser.id,
        },
      });
    }
  }
}

return token;


        
  
    },

    /**
     * Session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "ADMIN"
          | "TECHNICIAN"
          | "CLIENT";
      }

      return session;
    },
  },
});
import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [],

  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      const isLoggedIn = !!auth?.user;

      if (
        pathname.startsWith("/panel") ||
        pathname.startsWith("/mi-cuenta")
      ) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
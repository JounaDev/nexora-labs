import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log("====== MIDDLEWARE ======");
  console.log("PATH:", req.nextUrl.pathname);
  console.log("AUTH:", req.auth);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/lib/cart-context";
import { Providers } from "@/components/providers";
import { SplashScreen } from "@/components/splash/splash-screen";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora Labs — Laboratorio Tecnológico",
  description:
    "Reparación y desarrollo de software en Bogotá.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900,500&display=swap"
          rel="stylesheet"
        />
           <link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900,500&display=swap" rel="stylesheet" />
    
      </head>

      <body>
        <Providers>
          <ThemeProvider>
           {/* <SplashScreen />*/}
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";
// Reutiliza colores/animaciones del design system — nada se redefine dos veces.
import baseConfig from "../../packages/ui/tailwind.config";

const config: Config = {
  ...baseConfig,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/components/**/*.{ts,tsx}",
  ],
};

export default config;

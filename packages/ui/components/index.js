/**
 * Nexora Labs — packages/ui/components/index.tsx
 *
 * Dependencias: framer-motion, next-themes, lucide-react, clsx
 * (ya listadas en el stack de Fase 1)
 */
"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
const variantStyles = {
    primary: "bg-text text-bg hover:opacity-90",
    glass: "glass-strong text-text",
    ghost: "border border-border/20 text-text-muted hover:text-text",
};
export function Button({ variant = "primary", children, scan = false, className, ...props }) {
    const ref = useRef(null);
    const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
    const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
    function handleMouseMove(e) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect)
            return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
    }
    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }
    return (<motion.button ref={ref} style={{ x, y }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={clsx("relative overflow-hidden rounded-full px-7 py-3.5 font-display font-medium transition-colors", variantStyles[variant], scan && "group", className)} {...props}>
      {children}
      {scan && (<span aria-hidden className="pointer-events-none absolute inset-y-0 left-[-30%] w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-scan"/>)}
    </motion.button>);
}
export function GlassCard({ children, className, scan = true }) {
    return (<div className={clsx("glass group relative overflow-hidden rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1", className)}>
      {children}
      {scan && (<span aria-hidden className="pointer-events-none absolute inset-y-0 left-[-30%] w-[30%] -skew-x-12 bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-scan"/>)}
    </div>);
}
// ---------------------------------------------------------------
// StatusBadge — refleja el enum RepairStatus del schema (Fase 1)
// ---------------------------------------------------------------
const STATUS_CONFIG = {
    RECEIVED: { label: "Recibido", color: "text-muted" },
    DIAGNOSIS: { label: "Diagnóstico", color: "blue" },
    AWAITING_PARTS: { label: "Repuestos", color: "warning" },
    IN_REPAIR: { label: "En reparación", color: "purple" },
    TESTING: { label: "Pruebas", color: "cyan" },
    COMPLETED: { label: "Finalizado", color: "success" },
    DELIVERED: { label: "Entregado", color: "success" },
    CANCELLED: { label: "Cancelado", color: "danger" },
};
export function StatusBadge({ status }) {
    const { label, color } = STATUS_CONFIG[status];
    const pulsing = status !== "COMPLETED" && status !== "DELIVERED" && status !== "CANCELLED";
    return (<span className={clsx("inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs", `bg-${color}/15 text-${color}`)}>
      <span className="relative h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "currentColor" }}>
        {pulsing && (<span aria-hidden className="absolute -inset-1 animate-pulse-ring rounded-full border border-current"/>)}
      </span>
      {label}
    </span>);
}
// ---------------------------------------------------------------
// ThemeToggle — requiere <ThemeProvider attribute="class"> de next-themes
// envolviendo el layout raíz
// ---------------------------------------------------------------
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    return (<button onClick={() => setTheme(isDark ? "light" : "dark")} className="glass flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:text-text" aria-label="Cambiar tema">
      {isDark ? <Sun size={16}/> : <Moon size={16}/>}
    </button>);
}

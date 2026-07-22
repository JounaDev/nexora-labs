// apps/web/components/splash/splash-screen.tsx
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { ChromeSphere } from "./chrome-sphere";

const SESSION_KEY = "nexora_splash_shown";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const progress = useMotionValue(0);

  // Solo una vez por sesión de navegador — no en cada página, no en cada refresh.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setMounted(true);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    // ease cinematográfico: arranca rápido, se asienta suave — nada de
    // linear, que se siente mecánico.
    const controls = animate(progress, 1, {
      duration: 40,
      delay: 0.3, // Escena 1: negro puro antes de que pase nada
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setPlaying(false), // dispara el exit de AnimatePresence
    });
    return () => controls.stop();
  }, [playing, progress]);

  // Ventanas de aparición de cada elemento, todas derivadas del mismo
  // progreso maestro — así todo queda sincronizado entre sí sin timers sueltos.
  const textOpacity = useTransform(progress, [0.42, 0.5], [0, 1]);
  const textY = useTransform(progress, [0.42, 0.5], [12, 0]);
  const sweepX = useTransform(progress, [0.42, 0.58], ["-120%", "220%"]);
  const readyOpacity = useTransform(progress, [0.6, 0.7], [0, 1]);
  const flashOpacity = useTransform(progress, [0.88, 0.97], [0, 1]);

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {playing && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-black"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
            <ChromeSphere progress={progress} />
          </Canvas>

          {/* Escena 8: el "flash" que vende que la pantalla se vuelve metal
              por completo — más confiable que hacer que la geometría 3D
              literalmente envuelva la cámara. */}
          <motion.div
            style={{ opacity: flashOpacity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,#d4d7e0_35%,#8a5cff_100%)]"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <motion.div style={{ opacity: textOpacity, y: textY }} className="relative overflow-hidden">
              <p className="font-display text-2xl font-black tracking-[0.35em] text-white sm:text-3xl">
                NEXORA <span className="text-cyan">LABS</span>
              </p>
              {/* Barra de luz que "revela" el texto en vez de un fade —
                  reutiliza el mismo motivo de scan pulse del design system. */}
              <motion.span
                style={{ x: sweepX }}
                className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              />
            </motion.div>

            <motion.p style={{ opacity: textOpacity }} className="mt-3 font-mono text-xs tracking-[0.3em] text-text-muted">
              POWERED BY AI
            </motion.p>

            <motion.p style={{ opacity: readyOpacity }} className="mt-6 font-mono text-[0.65rem] tracking-[0.2em] text-cyan">
              SYSTEM READY
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

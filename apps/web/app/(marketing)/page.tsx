// apps/web/app/(marketing)/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@nexora/ui/components";
import { CvSection } from "@/components/home/cv-section";


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const SERVICES = [
  { title: "Equipos", desc: "Computadores, portátiles, celulares y tablets.", tags: ["Computadores", "Portátiles", "Celulares", "Tablets"] },
  { title: "Pantallas y periféricos", desc: "Smart TVs, monitores e impresoras.", tags: ["Smart TV", "Monitores", "Impresoras"] },
  { title: "Componentes a nivel de placa", desc: "GPU y placas madre — microsoldadura incluida.", tags: ["GPU", "Placas madre"] },
  { title: "Consolas", desc: "Xbox, PlayStation y Nintendo.", tags: ["Xbox", "PlayStation", "Nintendo"] },
  { title: "Datos y mantenimiento", desc: "Recuperación, limpieza y optimización.", tags: ["Recuperación", "Limpieza", "Optimización"] },
  { title: "Upgrade de componentes", desc: "Extiende la vida útil de tu equipo.", tags: ["Cambio de partes", "Actualización"] },
];

const DEV_CHIPS = ["Lua", "C", "C++", "Python", "Desarrollo Web", "Desarrollo Desktop", "Motores de videojuegos", "Automatización", "ESP32", "Arduino", "Backend", "Frontend", "Bases de datos", "APIs"];

const CAPABILITIES = [
  { title: "Diagnóstico", desc: "Evaluación técnica presencial antes de cualquier intervención." },
  { title: "Mantenimiento", desc: "Limpieza y revisión preventiva." },
  { title: "Cambio de componentes", desc: "Repuestos verificados y garantizados." },
  { title: "Microsoldadura", desc: "Reparación a nivel de placa." },
  { title: "Recuperación de datos", desc: "Rescate de información dañada." },
  { title: "Optimización", desc: "Máximo rendimiento de software y hardware." },
  { title: "Actualización", desc: "Upgrade cuando la reparación no basta." },
  { title: "Garantías", desc: "Cada intervención, respaldada por escrito." },
];

const PROJECTS = [
  {
    title: "Nexora",
    description:
      "Sistema completo para la gestión de talleres con autenticación, inventario, clientes, reparaciones y seguimiento.",
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Tailwind",
      "Auth.js",
    ],
  },
];

const STATS = [
  {
    value: "15+",
    label: "Tecnologías",
  },
  {
    value: "100%",
    label: "Responsive",
  },
  {
    value: "1",
    label: "Proyecto SaaS",
  },
  {
    value: "24/7",
    label: "Disponibilidad",
  },
];
<section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">

<p className="mb-3 font-mono text-xs tracking-[0.2em] text-text-muted">
05 · ESTADÍSTICAS
</p>

<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

{STATS.map((item)=>(

<GlassCard key={item.label}>

<h3 className="font-display text-5xl font-black text-cyan">
{item.value}
</h3>

<p className="mt-2 text-text-muted">
{item.label}
</p>

</GlassCard>

))}

</div>

</section>


export default function HomePage() {
  return (
    <>
      {/* HERO — versión sin el objeto 3D del demo de Fase 3; ese port queda pendiente */}
      <section className="flex min-h-[85vh] flex-col justify-center px-6 sm:px-10">
        <p className="mb-5 font-mono text-xs tracking-[0.2em] text-cyan">LABORATORIO TECNOLÓGICO — BOGOTÁ</p>
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-3xl font-display text-5xl font-black leading-[0.95] sm:text-7xl"
        >
          Creamos.
          <br />
          Reparamos.
          <br />
          Innovamos.
        </motion.h1>
        <p className="mt-7 max-w-md text-lg text-text-muted">
          Hardware. Software. Electrónica. Desarrollo. Ingeniería de precisión para cada dispositivo y cada línea de código.
        </p>
      <div className="mt-10 flex flex-wrap gap-4">
  <Link
    href="/reservar"
    className="rounded-full bg-text px-7 py-4 font-display text-sm font-medium text-bg"
  >
    Solicitar reparación
  </Link>

  <Link
    href="#servicios"
    className="glass scan rounded-full px-7 py-4 font-display text-sm font-medium"
  >
    Ver servicios
  </Link>

  <Link
    href="#cv"
    className="glass rounded-full px-7 py-4 font-display text-sm font-medium"
  >
    Sobre mí
  </Link>
</div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-text-muted">01 · SERVICIOS</p>
        <h2 className="mb-12 max-w-lg font-display text-3xl font-black sm:text-4xl">
          Cada categoría, tratada como su propia disciplina de ingeniería.
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <motion.div key={s.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
              <GlassCard>
                <h3 className="mb-2 font-display font-bold">{s.title}</h3>
                <p className="mb-4 text-sm text-text-muted">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full bg-surface/6 px-2.5 py-1 font-mono text-[0.65rem] text-text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DESARROLLO */}
      <section id="desarrollo" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-text-muted">02 · DESARROLLO</p>
        <h2 className="mb-12 max-w-lg font-display text-3xl font-black sm:text-4xl">
          También construimos el software que corre en el hardware que reparamos.
        </h2>
        <div className="flex flex-wrap gap-3">
          {DEV_CHIPS.map((chip) => (
            <span key={chip} className="glass rounded-full px-5 py-3 text-sm transition-transform hover:-translate-y-0.5 hover:border-cyan/40">
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* CAPACIDADES */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-text-muted">03 · CAPACIDADES TÉCNICAS</p>
        <h2 className="mb-12 max-w-lg font-display text-3xl font-black sm:text-4xl">
          De la sospecha inicial a la garantía por escrito.
        </h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="glass !rounded-none p-6">
              <h4 className="mb-1 font-display font-bold">{c.title}</h4>
              <p className="text-sm text-text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
{/* SOBRE MÍ */}
<CvSection />

{/* CTA */}
<section className="px-6 py-32 text-center sm:px-10"></section>
      {/* CTA */}
      <section className="px-6 py-32 text-center sm:px-10">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-text-muted">¿EMPEZAMOS?</p>
        <h2 className="mx-auto mb-10 max-w-xl font-display text-4xl font-black sm:text-5xl">
          Trae el problema. Nosotros traemos la precisión.
        </h2>
        <Link href="/reservar" className="rounded-full bg-text px-8 py-4 font-display text-sm font-medium text-bg">
          Solicitar reparación
        </Link>
      </section>
    </>
  );

  
}

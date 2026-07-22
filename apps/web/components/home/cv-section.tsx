import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  Download,
  MapPin,
  ArrowUp,
} from "lucide-react";

export function CvSection() {
  return (
    <section
      id="cv"
      className="mx-auto max-w-7xl px-6 py-24 sm:px-10"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Información */}
        <div>
          <span className="rounded-full border border-cyan/40 px-3 py-1 text-sm text-cyan">
            Sobre mí
          </span>

          <h2 className="mt-4 font-display text-5xl font-black">
            Youstin Ospina
          </h2>
          <div className="mt-6">
  <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan">
    🎵 Mi soundtrack mientras programo
  </p>

  <iframe
    style={{ borderRadius: "12px" }}
    src="https://open.spotify.com/embed/track/2FML7gk7ac6quGFIjvkDb3"
    width="100%"
    height="152"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  />
</div>

          <p className="mt-4 text-lg text-text-muted">
            Soy desarrollador Full Stack especializado en Next.js,
            TypeScript, Prisma y PostgreSQL. También trabajo en
            electrónica, reparación de hardware y desarrollo de
            soluciones tecnológicas.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-cyan" size={18} />
              <span>Bogotá, Colombia</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-cyan" size={18} />
              <span>iospna24000@gmail.com</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://github.com/JounaDev"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-3 transition hover:scale-105"
            >
              <Github />
            </a>

            <a
              href="https://linkedin.com/in/TU_USUARIO"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-3 transition hover:scale-105"
            >
              <Linkedin />
            </a>

            <a
              href="mailto:iospna24000@gmail.com"
              className="glass rounded-xl p-3 transition hover:scale-105"
            >
              <Mail />
            </a>

            <a
              href="/cv.pdf"
              download
              className="rounded-xl bg-cyan px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Download size={18} />
                Descargar CV
              </span>
            </a>
          </div>
        </div>

        {/* Tecnologías */}
        <div className="glass rounded-3xl p-8">
          <h3 className="mb-6 font-display text-3xl font-bold">
            Tecnologías que manejo
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "Next.js",
              "React",
              "C++",
              "Lua",
              "js",
              "Python",
              "TypeScript",
              "Tailwind CSS",
              "Prisma",
              "PostgreSQL",
              "Docker",
              "Git",
              "GitHub",
              "Vercel",
            ].map((tech) => (
              <span
                key={tech}
                className="glass rounded-full px-4 py-2 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-cyan/20 p-6">
            <h4 className="font-display text-2xl font-bold">
              Proyecto principal
            </h4>

            <p className="mt-3 text-text-muted">
              <strong>Nexora</strong> es una plataforma para la gestión
              de talleres de reparación con autenticación, clientes,
              inventario, seguimiento de equipos, dashboard,
              notificaciones y panel administrativo.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan/30 px-5 py-3 transition hover:bg-cyan/10"
            >
              Ver proyecto
            </Link>
          </div>
        </div>
      </div>

      {/* Volver arriba */}
      <div className="mt-16 flex justify-center">
        <Link
          href="#top"
          className="glass flex items-center gap-2 rounded-full px-6 py-3 transition hover:scale-105"
        >
          <ArrowUp size={18} />
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
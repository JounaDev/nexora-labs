# Nexora Labs — Design System
### Fase 2 de 9

---

## Elemento de firma: Scan Pulse

Todo el sistema gira alrededor de una idea: **la plataforma es un instrumento de diagnóstico, no una tienda**. El elemento distintivo — presente en botones, tarjetas y badges de estado — es un barrido de luz cyan que cruza los bordes al interactuar, como el escaneo de un equipo técnico. Los puntos de estado "laten" igual que un monitor de laboratorio. Es el hilo que conecta el hero, el dashboard y el portal del cliente bajo una misma metáfora visual.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#000000` | Fondo base (negro profundo, no `#0a0a0a` genérico) |
| `purple` | `#8A5CFF` | Acento — bordes, glow, un 5-10% del lienzo como máximo |
| `blue` | `#3E82FA` | Acento secundario |
| `cyan` | `#22D3EE` | Acento de interacción — el color del "scan pulse" |
| `text` / `text-muted` | `#FFFFFF` / `#A3A3AD` | Jerarquía tipográfica |

Regla dura: los tres acentos nunca son un fondo sólido de sección completa. Se usan en bordes, glows de 15-20% de opacidad y detalles de gradiente puntuales — así es como se evita el look "chillón" que pediste evitar.

## Tipografía

- **Satoshi** (display, peso 700/900) — titulares y cifras de impacto. Es la que le da personalidad a la página; se usa con moderación, nunca en párrafos largos.
- **Inter** (cuerpo, 400/500/600) — texto de lectura y UI general.
- **JetBrains Mono** — códigos de ticket (`NL-2026-00045`), cifras técnicas, metadatos. Refuerza la sensación de "datos de laboratorio" en vez de "marketing genérico".

## Superficies de cristal

Dos niveles: `.glass` (paneles secundarios, 5% opacidad + blur 20px) y `.glass-strong` (elementos primarios, 8% opacidad + blur 28px). Ambos definidos como utilidades CSS reutilizables en `tokens.css`, además de expuestos como color tokens de Tailwind para composición directa.

## Modo claro/oscuro

Los tokens usan valores RGB space-separated (`--color-bg: 0 0 0`) para que Tailwind controle la opacidad vía `rgb(var(--token) / <alpha-value>)`. El cambio de tema es una clase `.light` en `<html>`, gestionada por `next-themes` con detección automática de `prefers-color-scheme` y toggle manual (componente `ThemeToggle`).

## Motion

- **Magnetic buttons**: Framer Motion (`useMotionValue` + `useSpring`), el botón se desplaza sutilmente hacia el cursor.
- **Scan pulse**: CSS puro (keyframe `scan`), se dispara en hover — no es ambiental/constante para no distraer.
- **Pulse ring**: usado solo en badges de estado activos (no en "Finalizado" ni "Cancelado" — ahí el pulso se detiene, lo cual comunica algo real: el proceso ya no está en curso).
- Todo respeta `prefers-reduced-motion: reduce`.

## Archivos entregados

| Archivo | Ubicación en el monorepo | Contenido |
|---|---|---|
| `tokens.css` | `packages/ui/styles/tokens.css` | Variables CSS de color, radio, blur |
| `tailwind.config.ts` | `packages/ui/tailwind.config.ts` | Extensión de tema, keyframes, animaciones |
| `components.tsx` | `packages/ui/components/index.tsx` | `Button`, `GlassCard`, `StatusBadge`, `ThemeToggle` |
| `design-system-preview.html` | — (solo para revisión visual) | Preview interactivo, no forma parte del código final |

`StatusBadge` ya está tipado contra el enum `RepairStatus` del `schema.prisma` de Fase 1 — cuando construyamos el seguimiento de reparaciones en Fase 7, este componente se conecta directo sin adaptar nada.

## Siguiente paso

Con tokens y componentes base listos, la Fase 3 (Landing premium con Three.js) se construye componiendo estas mismas piezas — nada de esto se descarta ni se reescribe.

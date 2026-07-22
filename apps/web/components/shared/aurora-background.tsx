// apps/web/components/shared/aurora-background.tsx
//
// El efecto ya existía como CSS suelto (.aurora / @keyframes drift en
// globals.css) copiado a mano solo dentro del layout de marketing. Esto lo
// convierte en un componente real para poder ponerlo en cualquier página
// sin repetir el markup — el CSS no cambia, ya vive en globals.css.
export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden>
      <span />
      <span />
      <span />
    </div>
  );
}

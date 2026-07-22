# Nexora Labs — E-commerce e Inventario
### Fase 9 de 9 — última fase del plan original

---

## Inventario

`app/panel/inventario/page.tsx` ya no es una lista estática: calcula stock bajo comparando `quantity` contra `minStock` de cada ítem y lo destaca arriba de la tabla. `StockControls` permite ajustar `+1/-1` directamente desde la lista — es la acción que más se usa en el día a día, así que no debía requerir abrir un formulario completo.

Esta misma tabla (`InventoryItem`) es la que ya usa `RepairPart` en Fase 7 para descontar repuestos de una reparación — inventario y e-commerce comparten una sola fuente de verdad, tal como quedó modelado desde el schema de Fase 1.

## Tienda

Los modelos `Product`/`Order`/`OrderItem` ya existían desde Fase 1 con `isActive: false` por defecto — esta fase los "enciende": catálogo (`/tienda`), detalle de producto (`/tienda/[slug]`), carrito y checkout.

**Carrito en `localStorage`, no en base de datos.** Para un catálogo de este tamaño no vale la pena la complejidad de un carrito persistido server-side con sesiones anónimas — `CartProvider` guarda el estado en el navegador vía `useState` + `localStorage`. Nota: esto es código de producción real, no un artifact de Claude — la restricción de `localStorage` que rige en el sandbox de vista previa no aplica acá.

**Checkout por WhatsApp**, igual que en las reservas de Fase 8 — consistente con Verlaire y La Forneria. El carrito arma el mensaje con cada línea y el total, y abre `wa.me` con todo pre-escrito. No hay pasarela de pago todavía: es un punto de partida real para vender, no una demo — cuando quieras aceptar pagos en línea de verdad, ahí es donde entra Wompi (ya lo dejamos anotado como decisión pendiente desde Fase 1).

## Integración pendiente (una línea, a propósito no la hice sin que la veas)

`CartProvider` necesita envolver el layout raíz (`app/layout.tsx`) para que el carrito persista entre `/tienda` y el resto del sitio:

```tsx
// apps/web/app/layout.tsx
import { CartProvider } from "@/lib/cart-context";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
```

Y `<CartDrawer />` se agrega una sola vez, en el layout de marketing, para que flote en todas las páginas públicas.

## Archivos entregados

| Archivo | Ubicación real |
|---|---|
| `tienda-preview.html` | — (solo revisión visual) |
| `inventory.actions.ts` | `apps/web/lib/actions/inventory.actions.ts` |
| `inventario-page.tsx` | `apps/web/app/panel/inventario/page.tsx` |
| `stock-controls.tsx` | `apps/web/components/dashboard/stock-controls.tsx` |
| `cart-context.tsx` | `apps/web/lib/cart-context.tsx` |
| `product-card.tsx` | `apps/web/components/store/product-card.tsx` |
| `cart-drawer.tsx` | `apps/web/components/store/cart-drawer.tsx` |
| `tienda-page.tsx` | `apps/web/app/tienda/page.tsx` |
| `producto-detalle.tsx` | `apps/web/app/tienda/[slug]/page.tsx` |
| `add-to-cart-button.tsx` | `apps/web/components/store/add-to-cart-button.tsx` |

---

## Las 9 fases están completas. Esto es lo que queda para que corra de verdad — no es parte del plan original, pero es indispensable:

1. **Scaffold del monorepo** — `package.json` raíz y por app, `turbo.json`, `tsconfig.json` compartido, wiring real de Tailwind/Next entre `apps/web` y `packages/*`.
2. **Seed de Prisma** — crear el primer usuario `ADMIN` a mano (mencionado desde Fase 4, nunca construido).
3. **Páginas referenciadas pero no creadas:** `/login`, `/panel/clientes`, `/panel/facturacion`, `/panel/usuarios`, `/panel/reportes`, `/panel/calendario`, `/mi-cuenta/facturas` — todas siguen el mismo patrón ya establecido (layout protegido → Server Component → Prisma → componentes de Fase 2).
4. **Índice único en `Appointment`** (`@@unique([locationId, scheduledAt])`) para cerrar del todo la ventana de doble reserva de Fase 8.
5. **Port de la landing** de Three.js vanilla (Fase 3) a componentes reales de React Three Fiber.
6. **SEO** — metadata, sitemap, robots — pedido en el brief original, no se tocó todavía.
7. **Despliegue** — `apps/web` en Vercel, `apps/realtime` en Railway/Render/Docker, PostgreSQL en Neon/Supabase.

¿Seguimos con el scaffold + seed + páginas faltantes para que lo que ya existe corra en tu máquina, o prefieres que primero construya alguna de las páginas específicas de la lista?

// apps/web/lib/wompi.ts
import crypto from "crypto";

// Wompi Web Checkout: se arma la URL con una firma de integridad para que
// nadie pueda cambiar el monto desde el navegador. La fórmula exacta según
// la documentación de Wompi es:
//   SHA256(referencia + montoEnCentavos + moneda + secretoDeIntegridad)
//
// No pude probar esto contra el sandbox real de Wompi desde acá — verifica
// el primer pago de prueba contra tu dashboard de Wompi antes de confiar
// en esto en producción.

interface WompiCheckoutParams {
  amountInCents: number;
  reference: string;
  redirectUrl: string;
}

export function generateWompiCheckoutUrl(params: WompiCheckoutParams): string | null {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

if (!publicKey) {
  throw new Error("WOMPI_PUBLIC_KEY no configurada");
}

if (!integritySecret) {
  throw new Error("WOMPI_INTEGRITY_SECRET no configurada");
}

  const { amountInCents, reference, redirectUrl } = params;
  const currency = "COP";

  const signaturePayload = `${reference}${amountInCents}${currency}${integritySecret}`;
  const signature = crypto.createHash("sha256").update(signaturePayload).digest("hex");

  const url = new URL("https://checkout.wompi.co/p/");
  url.searchParams.set("public-key", publicKey);
  url.searchParams.set("currency", currency);
  url.searchParams.set("amount-in-cents", String(amountInCents));
  url.searchParams.set("reference", reference);
  if (redirectUrl) {
  url.searchParams.set("redirect-url", redirectUrl);
}
  url.searchParams.set("signature:integrity", signature);

  return url.toString();
}

// Verificación de la firma de un evento de webhook de Wompi.
// Wompi manda `signature.checksum` + `signature.properties` (qué campos del
// evento se usaron) + `timestamp`. Se concatenan los valores de esas
// propiedades (en el orden que Wompi indique) + timestamp + el secreto de
// eventos, se saca SHA256, y debe coincidir con el checksum recibido.
export function verifyWompiWebhookSignature(body: {
  signature: { checksum: string; properties: string[] };
  timestamp: number;
  data: Record<string, unknown>;
}): boolean {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) return false;

  function getByPath(obj: unknown, path: string): unknown {
    return path.split(".").reduce((acc: unknown, key) => (acc as Record<string, unknown>)?.[key], obj);
  }

  const concatenated = body.signature.properties.map((path) => String(getByPath(body.data, path))).join("");
  const payload = `${concatenated}${body.timestamp}${eventsSecret}`;
  const expected = crypto.createHash("sha256").update(payload).digest("hex");

  return expected === body.signature.checksum;
}

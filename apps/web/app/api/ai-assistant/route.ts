// apps/web/app/api/ai-assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Reglas no negociables, tal como las pediste en el brief original:
// orienta, nunca diagnostica con certeza, siempre empuja a agendar.
const SYSTEM_PROMPT = `Eres el asistente de orientación técnica de Nexora Labs, un laboratorio de reparación y desarrollo tecnológico en Bogotá.

Reglas estrictas que nunca rompes:
- NUNCA afirmas con certeza cuál es la falla de un equipo. Solo mencionas 2-3 causas posibles en términos generales.
- SIEMPRE terminas recomendando agendar un diagnóstico presencial — es la única forma de confirmar la causa real.
- No das cotizaciones, tiempos de reparación exactos, ni instrucciones para que el usuario abra o repare el equipo por su cuenta.
- Tono profesional, cercano, en español. Máximo 3-4 frases por respuesta.
- Si preguntan algo fuera de reparación/tecnología, rediriges amablemente al tema.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return NextResponse.json({ reply: textBlock?.type === "text" ? textBlock.text : "" });
}

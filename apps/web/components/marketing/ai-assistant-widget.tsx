// apps/web/components/marketing/ai-assistant-widget.tsx
"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function AiAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hola 👋 Cuéntame qué le pasa a tu equipo y te oriento. Para confirmar la causa siempre vas a necesitar un diagnóstico presencial." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-black shadow-lg"
        aria-label="Abrir asistente"
      >
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <div className="glass fixed bottom-6 right-6 z-50 flex h-[28rem] w-80 flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm font-bold">Asistente Nexora</span>
        <button onClick={() => setOpen(false)} aria-label="Cerrar">
          <X size={16} className="text-text-muted" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-text" : "text-text-muted"}>
            <span className="font-mono text-xs text-cyan">{m.role === "user" ? "Tú: " : "Nexora: "}</span>
            {m.content}
          </p>
        ))}
        {loading && <p className="text-xs text-text-muted">Escribiendo...</p>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe el problema..."
          className="flex-1 rounded-lg border border-border/10 bg-surface/5 px-3 py-2 text-sm placeholder:text-text-muted"
        />
        <button onClick={send} className="rounded-lg bg-cyan/15 px-3 text-cyan">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

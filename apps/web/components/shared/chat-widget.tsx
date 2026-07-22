// apps/web/components/shared/chat-widget.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export function ChatWidget({ conversationId, initialMessages }: { conversationId: string; initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let socket: Socket;

    (async () => {
      const res = await fetch("/api/socket-token");
      if (!res.ok) return;
      const { token } = await res.json();

      socket = io(process.env.NEXT_PUBLIC_REALTIME_URL!, { auth: { token } });
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
      socket.emit("join-conversation", conversationId);
      socket.on("new-message", (msg: Message) => setMessages((prev) => [...prev, msg]));
      socketRef.current = socket;
    })();

    return () => {
      socket?.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit("send-message", { conversationId, content: input });
    setInput("");
  }

  return (
    <div className="glass flex h-96 flex-col rounded-2xl p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-success" : "bg-text-muted"}`} />
        <span className="font-mono text-[0.65rem] text-text-muted">{connected ? "En línea" : "Conectando..."}</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-mono text-xs text-cyan">{m.sender.name}: </span>
            <span className="text-text">{m.content}</span>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-text-muted">Aún no hay mensajes. Escribe el primero.</p>}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-lg border border-border/10 bg-surface/5 px-3 py-2 text-sm text-text placeholder:text-text-muted"
        />
        <button onClick={sendMessage} className="rounded-lg bg-cyan/15 px-4 text-sm text-cyan">
          Enviar
        </button>
      </div>
    </div>
  );
}

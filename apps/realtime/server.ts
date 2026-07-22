// apps/realtime/server.ts
//
// Servicio independiente — NO se despliega en Vercel (ver ARCHITECTURE.md,
// sección 6: Vercel no soporta WebSockets persistentes). Se despliega en
// Railway/Render/Docker con `node server.js` corriendo indefinidamente.
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: process.env.WEB_APP_URL, credentials: true },
});

interface SocketAuth {
  id: string;
  role: "ADMIN" | "TECHNICIAN" | "CLIENT";
}

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token as string;
    const payload = jwt.verify(token, process.env.REALTIME_JWT_SECRET!) as SocketAuth;
    socket.data.user = payload;
    next();
  } catch {
    next(new Error("No autorizado"));
  }
});

io.on("connection", (socket) => {
  socket.on("join-conversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("send-message", async ({ conversationId, content }: { conversationId: string; content: string }) => {
    if (!content?.trim()) return;
    const message = await prisma.chatMessage.create({
      data: { conversationId, senderId: socket.data.user.id, content: content.trim() },
      include: { sender: true },
    });
    io.to(`conversation:${conversationId}`).emit("new-message", message);
  });
});

// Canal interno: la app Next.js llama esto (server-to-server) cuando algo
// cambia fuera del chat pero debe reflejarse en vivo — ej. ticket.service.ts
// empujando un cambio de estado a quien esté mirando ese ticket ahora mismo.
httpServer.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/internal/broadcast") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { room, event, payload } = JSON.parse(body);
        io.to(room).emit(event, payload);
        res.writeHead(200);
        res.end("ok");
      } catch {
        res.writeHead(400);
        res.end("bad request");
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Realtime service escuchando en :${PORT}`));

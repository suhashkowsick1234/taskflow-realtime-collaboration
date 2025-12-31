import http from "http";
import { Server } from "socket.io";
import app from "./app";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite port
    credentials: true,
  },
});

export const getIO = () => io;

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;

  if (userId) {
    socket.join(userId);
    console.log(`🟢 User ${userId} joined socket room`);
  } else {
    console.log("⚠️ Socket connected without userId");
  }

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});


server.listen(4000, () => {
  console.log("🚀 Server running on port 4000");
});

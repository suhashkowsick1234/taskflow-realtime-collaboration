import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("✅ Connected to socket server");
});

socket.on("task:created", data => {
  console.log("📥 task:created", data);
});

socket.on("task:updated", data => {
  console.log("📥 task:updated", data);
});

socket.on("task:assigned", data => {
  console.log("📥 task:assigned", data);
});

socket.on("task:deleted", data => {
  console.log("📥 task:deleted", data);
});

import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Create a basic HTTP server (Socket.IO will attach to this)
const httpServer = createServer();

// Create a new Socket.IO server instance
const io = new SocketIOServer(httpServer, {
  path: "/ws",
  cors: {
    origin: "*", // Adjust to match your front-end domain if needed
    methods: ["GET", "POST"],
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle sending/receiving messages
  socket.on("message", (messageData) => {
    const { roomId, content, user } = messageData; // Extract fields correctly
    if (!content) {
      console.error(`Received malformed message data: ${JSON.stringify(messageData)}`);
      return;
    }
    console.log(`Message received in room ${roomId}:`, content);
    io.to(roomId).emit("message", { ...messageData, user });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the WebSocket server on port 4000 (or any other port)
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});

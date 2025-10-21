let io;

module.exports = {
  init: (httpServer) => {
    const socketio = require("socket.io");
    io = socketio(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected via Socket.IO");

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};

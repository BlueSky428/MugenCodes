const { Server: SocketIOServer } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

let io = null;

function initializeSocket(server) {
  io = new SocketIOServer(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.js:21',message:'socket.io connection',data:{socketId:socket.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion agent log

    // Join project room
    socket.on("join-project", async (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.js:28',message:'join-project',data:{socketId:socket.id,projectId},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion agent log
    });

    // Leave project room
    socket.on("leave-project", (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`Socket ${socket.id} left project:${projectId}`);
    });

    // Handle new message
    socket.on("send-message", async (data) => {
      try {
        // Verify user has access to project
        const project = await prisma.project.findUnique({
          where: { id: data.projectId },
        });

        if (!project) {
          socket.emit("error", { message: "Project not found" });
          return;
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
        });

        if (!user) {
          socket.emit("error", { message: "User not found" });
          return;
        }

        // Check permissions
        if (user.role === "CLIENT" && project.clientId !== user.id) {
          socket.emit("error", { message: "Forbidden" });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content: data.content,
            projectId: data.projectId,
            senderId: data.userId,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        });

        // Broadcast to all clients in the project room
        io.to(`project:${data.projectId}`).emit("new-message", message);
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.js:86',message:'emitted new-message',data:{projectId:data.projectId,messageId:message.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion agent log
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle project update notification
    socket.on("project-updated", (projectId) => {
      // Broadcast project update to all clients in the room
      io.to(`project:${projectId}`).emit("refresh-project", projectId);
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.js:96',message:'emitted refresh-project (from client event)',data:{projectId},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion agent log
    });

    // Handle project status change notification
    socket.on("project-status-changed", (data) => {
      // Broadcast project status change to all clients in the room
      io.to(`project:${data.projectId}`).emit("project-status-updated", data);
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.js:104',message:'emitted project-status-updated (from client event)',data:{projectId:data?.projectId,status:data?.status,hasProject:!!data?.project},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion agent log
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}

module.exports = { initializeSocket, getIO };

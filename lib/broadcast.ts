/**
 * Helper function to broadcast project changes via WebSocket
 * This can be used from API routes to notify clients of project updates
 * 
 * Broadcasts to:
 * 1. Project-specific room (for detail pages)
 * 2. All connected clients (for list pages and dashboards)
 */

export async function broadcastProjectChange(projectId: string, changeType: "status" | "update" | "milestone" | "payment" | "deleted", data?: any) {
  try {
    // IMPORTANT: route handlers must use the same singleton that `server.js` initializes.
    // That singleton lives in CommonJS `lib/socket.js`.
    const socketModule = require("./socket.js");
    const io = socketModule.getIO();
    
    if (changeType === "status") {
      const payload = {
        projectId,
        status: data?.status,
        project: data?.project,
      };
      
      // Broadcast to project-specific room (for detail pages)
      io.to(`project:${projectId}`).emit("project-status-updated", payload);
      
      // Also broadcast to all connected clients (for list pages and dashboards)
      io.emit("project-status-updated", payload);
    } else if (changeType === "deleted") {
      // Broadcast project deletion
      const payload = {
        projectId: data?.projectId || projectId,
        deleted: true,
      };
      
      // Broadcast to project-specific room (for detail pages)
      io.to(`project:${projectId}`).emit("project-deleted", payload);
      
      // Also broadcast to all connected clients (for list pages and dashboards)
      io.emit("project-deleted", payload);
      
      // Also emit refresh for list pages
      io.emit("refresh-project", projectId);
    } else {
      // Broadcast general refresh
      // To project-specific room
      io.to(`project:${projectId}`).emit("refresh-project", projectId);
      
      // Also broadcast to all connected clients
      io.emit("refresh-project", projectId);
    }
  } catch (error) {
    // WebSocket might not be initialized (e.g., in API routes during build)
    // This is OK - the client will poll for updates as fallback
    console.error("Error broadcasting project change:", error);
  }
}

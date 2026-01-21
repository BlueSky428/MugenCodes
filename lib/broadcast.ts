/**
 * Helper function to broadcast project changes via WebSocket
 * This can be used from API routes to notify clients of project updates
 */

export async function broadcastProjectChange(projectId: string, changeType: "status" | "update" | "milestone" | "payment", data?: any) {
  try {
    // IMPORTANT: route handlers must use the same singleton that `server.js` initializes.
    // That singleton lives in CommonJS `lib/socket.js`.
    const socketModule = require("./socket.js");
    const io = socketModule.getIO();
    
    if (changeType === "status") {
      // Broadcast status change with full project data
      io.to(`project:${projectId}`).emit("project-status-updated", {
        projectId,
        status: data?.status,
        project: data?.project,
      });
    } else {
      // Broadcast general refresh
      io.to(`project:${projectId}`).emit("refresh-project", projectId);
    }
  } catch (error) {
    // WebSocket might not be initialized (e.g., in API routes during build)
    // This is OK - the client will poll for updates as fallback
    console.error("Error broadcasting project change:", error);
  }
}

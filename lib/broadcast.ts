/**
 * Helper function to broadcast project changes via WebSocket
 * This can be used from API routes to notify clients of project updates
 */

export async function broadcastProjectChange(projectId: string, changeType: "status" | "update" | "milestone" | "payment", data?: any) {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/broadcast.ts:6',message:'broadcastProjectChange called',data:{projectId,changeType,hasData:!!data,hasStatus:!!data?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion agent log
  try {
    // IMPORTANT: route handlers must use the same singleton that `server.js` initializes.
    // That singleton lives in CommonJS `lib/socket.js`.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const socketModule = require("./socket.js");
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/broadcast.ts:16',message:'Loaded ./socket.js (CJS module)',data:{hasGetIO:typeof (socketModule as any)?.getIO === 'function'},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion agent log
    const io = socketModule.getIO();
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/broadcast.ts:20',message:'Got io from CJS socket module',data:{ioOk:!!io},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion agent log
    
    if (changeType === "status") {
      // Broadcast status change with full project data
      io.to(`project:${projectId}`).emit("project-status-updated", {
        projectId,
        status: data?.status,
        project: data?.project,
      });
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/broadcast.ts:26',message:'Emitted project-status-updated',data:{projectId,status:data?.status,hasProject:!!data?.project},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion agent log
    } else {
      // Broadcast general refresh
      io.to(`project:${projectId}`).emit("refresh-project", projectId);
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/broadcast.ts:31',message:'Emitted refresh-project',data:{projectId,changeType},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion agent log
    }
  } catch (error) {
    // WebSocket might not be initialized (e.g., in API routes during build)
    // This is OK - the client will poll for updates as fallback
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/broadcast.ts:42',message:'Broadcast failed',data:{projectId,changeType,error:String((error as any)?.message || error)},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion agent log
    console.error("Error broadcasting project change:", error);
  }
}

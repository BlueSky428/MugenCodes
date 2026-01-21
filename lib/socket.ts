/**
 * IMPORTANT:
 * The Socket.IO server is initialized in `server.js` via CommonJS `lib/socket.js`.
 * Next.js route handlers run in a different module system / bundler context.
 *
 * To ensure API routes can broadcast through the SAME singleton Socket.IO instance,
 * this TypeScript module acts as a thin bridge to the CommonJS implementation.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyServer = any;

export function initializeSocket(server: AnyServer) {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:18',message:'initializeSocket bridge called',data:{hasServer:!!server},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion agent log
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("./socket.js");
  return mod.initializeSocket(server);
}

export function getIO() {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/c327e57a-cec4-4772-8156-daa3914e05f0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/socket.ts:28',message:'getIO bridge called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion agent log
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("./socket.js");
  return mod.getIO();
}

/**
 * IMPORTANT:
 * The Socket.IO server is initialized in `server.js` via CommonJS `lib/socket.js`.
 * Next.js route handlers run in a different module system / bundler context.
 *
 * To ensure API routes can broadcast through the SAME singleton Socket.IO instance,
 * this TypeScript module acts as a thin bridge to the CommonJS implementation.
 */

type AnyServer = unknown;

export function initializeSocket(server: AnyServer) {
  const mod = require("./socket.js");
  return mod.initializeSocket(server);
}

export function getIO() {
  const mod = require("./socket.js");
  return mod.getIO();
}

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { initializeSocket } = require("./lib/socket.js");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
let port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function tryListen(server, startPort, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    function attemptListen() {
      if (attempts >= maxAttempts) {
        reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
        return;
      }

      const listenErrorHandler = (err) => {
        if (err.code === "EADDRINUSE") {
          attempts++;
          currentPort++;
          server.removeListener("error", listenErrorHandler);
          // Close any partial connection
          server.close(() => {
            attemptListen();
          });
        } else {
          server.removeListener("error", listenErrorHandler);
          reject(err);
        }
      };

      server.once("error", listenErrorHandler);
      server.listen(currentPort, () => {
        server.removeListener("error", listenErrorHandler);
        resolve(currentPort);
      });
    }

    attemptListen();
  });
}

app.prepare().then(async () => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.IO
  initializeSocket(httpServer);

  // Try to listen on the requested port, or find an available one
  const requestedPort = port;
  try {
    const actualPort = await tryListen(httpServer, port);
    if (actualPort !== requestedPort) {
      console.log(`⚠️  Port ${requestedPort} is in use, using port ${actualPort} instead.`);
      console.log(`⚠️  Update your .env file: NEXT_PUBLIC_SOCKET_URL=http://localhost:${actualPort}`);
      port = actualPort;
    }
    console.log(`> Ready on http://${hostname}:${port}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

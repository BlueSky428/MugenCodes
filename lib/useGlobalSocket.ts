"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

/**
 * Global WebSocket hook that listens for all project status updates
 * This is used by list pages and dashboards to refresh when any project changes
 */
export function useGlobalSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<Set<(projectId: string) => void>>(new Set());

  useEffect(() => {
    // Vercel does not support running our custom Socket.IO server (`server.js`).
    // Default to disabled unless explicitly enabled.
    const wsEnabled = process.env.NEXT_PUBLIC_ENABLE_WS === "true";
    if (!wsEnabled) {
      setConnected(false);
      setSocket(null);
      return;
    }
    if (!session?.user) return;

    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    
    const newSocket = io(socketUrl, {
      path: "/api/socket",
      auth: {
        userId: session.user.id,
        role: session.user.role,
      },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Global socket connected");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Global socket disconnected");
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Global socket connection error:", error);
      setConnected(false);
    });

    // Listen for any project status updates
    const handleStatusUpdate = (data: { projectId: string; status?: string; project?: any }) => {
      // Notify all registered callbacks
      callbacksRef.current.forEach((callback) => {
        callback(data.projectId);
      });
    };

    const handleRefresh = (projectId: string) => {
      // Notify all registered callbacks
      callbacksRef.current.forEach((callback) => {
        callback(projectId);
      });
    };

    newSocket.on("project-status-updated", handleStatusUpdate);
    newSocket.on("refresh-project", handleRefresh);

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("project-status-updated", handleStatusUpdate);
        socketRef.current.off("refresh-project", handleRefresh);
        socketRef.current.disconnect();
      }
    };
  }, [session]);

  // Register a callback to be called when any project updates
  const onProjectUpdate = (callback: (projectId: string) => void) => {
    callbacksRef.current.add(callback);
    return () => {
      callbacksRef.current.delete(callback);
    };
  };

  return { socket, connected, onProjectUpdate };
}

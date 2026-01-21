"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/useSocket";

type Message = {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  read: boolean;
  createdAt: string;
};

type ProjectChatProps = {
  projectId: string;
};

export function ProjectChat({ projectId }: ProjectChatProps) {
  const { data: session } = useSession();
  const { socket, connected } = useSocket(projectId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/messages`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load messages");
          return;
        }

        setMessages(data.messages || []);
      } catch (err) {
        setError("An error occurred while loading messages");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  // Listen for new messages via WebSocket (when enabled)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    };

    const handleError = (error: { message: string }) => {
      setError(error.message || "An error occurred");
    };

    socket.on("new-message", handleNewMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("error", handleError);
    };
  }, [socket]);

  // Fallback polling (Vercel/serverless-friendly) when WebSocket is disabled/unavailable
  useEffect(() => {
    if (!projectId || !session) return;
    if (socket && connected) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/messages`, { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data.messages) {
          setMessages(data.messages);
        }
      } catch {
        // ignore polling errors; UI will retry
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [projectId, session, socket, connected]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending || !socket || !connected) {
      if (!connected) {
        setError("Not connected. Please wait...");
      }
      return;
    }

    setSending(true);
    setError("");

    try {
      // Send via WebSocket
      socket.emit("send-message", {
        projectId,
        content: newMessage.trim(),
        userId: session?.user?.id,
      });

      setNewMessage("");
    } catch (err) {
      setError("An error occurred while sending message");
    } finally {
      setSending(false);
    }
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId === session?.user?.id;
  };

  const getSenderName = (message: Message) => {
    if (isOwnMessage(message)) {
      return "You";
    }
    const role = message.sender.role;
    if (role === "ADMIN" || role === "DEVELOPER") {
      return "Team";
    }
    return message.sender.name;
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
        <p className="text-center text-ink/70 dark:text-white/70">
          Loading messages...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white shadow-card dark:border-white/10 dark:bg-nightSoft flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-ink/10 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink dark:text-white">
              Project Messages
            </h3>
            <p className="text-sm text-ink/70 dark:text-white/70 mt-1">
              Real-time communication with {session?.user?.role === "CLIENT" ? "the team" : "the client"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {connected ? (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Connected
              </span>
            ) : (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Disconnected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-ink/50 dark:text-white/50 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isOwnMessage(message)
                    ? "bg-accent text-white"
                    : "bg-surface dark:bg-night border border-ink/10 dark:border-white/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-medium ${
                      isOwnMessage(message)
                        ? "text-white/80"
                        : "text-ink/70 dark:text-white/70"
                    }`}
                  >
                    {getSenderName(message)}
                  </span>
                  <span
                    className={`text-xs ${
                      isOwnMessage(message)
                        ? "text-white/60"
                        : "text-ink/50 dark:text-white/50"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    isOwnMessage(message)
                      ? "text-white"
                      : "text-ink dark:text-white"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 pb-2">
          <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-ink/10 dark:border-white/10">
        <div className="flex gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows={2}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            className="flex-1 rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/20 dark:bg-night dark:text-white resize-none"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

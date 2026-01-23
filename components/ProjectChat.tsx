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
      <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-center text-ink/70 dark:text-white/70 animate-pulse">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white shadow-card dark:border-white/10 dark:bg-nightSoft flex flex-col h-[600px] animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-ink/10 dark:border-white/10 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-ink dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Project Messages
            </h3>
            <p className="text-sm text-ink/70 dark:text-white/70 mt-1">
              Real-time communication with {session?.user?.role === "CLIENT" ? "the team" : "the client"}
            </p>
          </div>
          <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {connected ? (
              <span className="text-xs text-green-500 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="text-xs text-red-500 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Disconnected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
        {messages.length === 0 ? (
          <div className="text-center text-ink/50 dark:text-white/50 py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-base font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] ${
                  isOwnMessage(message)
                    ? "bg-gradient-primary text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs font-semibold ${
                      isOwnMessage(message)
                        ? "text-white/90"
                        : "text-ink/70 dark:text-white/70"
                    }`}
                  >
                    {getSenderName(message)}
                  </span>
                  <span
                    className={`text-xs ${
                      isOwnMessage(message)
                        ? "text-white/70"
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
        <div className="px-6 pb-2 animate-fade-in-down">
          <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-ink/10 dark:border-white/10 bg-white dark:bg-gray-900">
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
            className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm text-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus-visible:ring-primary-400 resize-none hover:border-gray-400 dark:hover:border-gray-600"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            {sending ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

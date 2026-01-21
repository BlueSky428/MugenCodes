"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type UnreadMessageBadgeProps = {
  projectId: string;
  className?: string;
};

export function UnreadMessageBadge({ projectId, className = "" }: UnreadMessageBadgeProps) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!projectId || !session) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/messages/unread`);
        const data = await response.json();

        if (response.ok) {
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();

    // Poll for unread messages every 5 seconds
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [projectId, session]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white ${className}`}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
}

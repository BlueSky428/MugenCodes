"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProjectsList } from "@/components/ProjectsList";
import { useGlobalSocket } from "@/lib/useGlobalSocket";
import { Section } from "@/components/Section";

export default function ApplicationInProgressPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { connected, onProjectUpdate } = useGlobalSocket();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects?status=APPLICATION_IN_PROGRESS", {
        cache: "no-store",
      });
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status, router, fetchProjects]);

  // Listen for project status updates via WebSocket
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = onProjectUpdate((projectId) => {
      // Refresh the list when any project updates
      fetchProjects();
    });

    return unsubscribe;
  }, [connected, onProjectUpdate, fetchProjects]);

  // Fallback polling when WebSocket is not available
  useEffect(() => {
    if (status !== "authenticated" || connected) return;

    const pollInterval = setInterval(() => {
      fetchProjects();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [status, connected, fetchProjects]);

  if (status === "loading" || loading) {
    return (
      <Section eyebrow="Projects" title="Application in progress">
        <div className="card card-dark p-8">
          <p className="muted">Loading…</p>
        </div>
      </Section>
    );
  }

  return (
    <ProjectsList
      projects={projects}
      title="Application in Progress"
      emptyMessage="No applications in progress."
    />
  );
}

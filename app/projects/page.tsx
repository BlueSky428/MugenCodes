"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { useGlobalSocket } from "@/lib/useGlobalSocket";

type Project = {
  id: string;
  name: string;
  status: string;
  developmentCost: number;
  deadline: string;
  createdAt: string;
  feasibilityStatus: string;
  negotiationPending?: string | null;
  developmentPlan?: string | null;
  milestones?: Array<{
    id: string;
    status: string;
  }>;
};

export default function ProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { connected, onProjectUpdate } = useGlobalSocket();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    applicationInProgress: 0,
    discussionInProgress: 0,
    developmentInProgress: 0,
    succeeded: 0,
    failed: 0,
  });

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch projects");
        setLoading(false);
        return;
      }

      const allProjects = data.projects || [];

      // Calculate statistics
      const statsData = {
        total: allProjects.length,
        applicationInProgress: allProjects.filter((p: Project) => p.status === "APPLICATION_IN_PROGRESS").length,
        discussionInProgress: allProjects.filter((p: Project) => p.status === "DISCUSSION_IN_PROGRESS").length,
        developmentInProgress: allProjects.filter((p: Project) => p.status === "DEVELOPMENT_IN_PROGRESS").length,
        succeeded: allProjects.filter((p: Project) => p.status === "SUCCEEDED").length,
        failed: allProjects.filter((p: Project) => p.status === "FAILED").length,
      };
      setStats(statsData);

      // Filter projects
      if (filter === "all") {
        setProjects(allProjects);
      } else {
        setProjects(allProjects.filter((p: Project) => p.status === filter));
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("An error occurred while fetching projects");
    } finally {
      setLoading(false);
    }
  }, [filter]);

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
      <Section eyebrow="Projects" title="My projects">
        <div className="card card-dark p-8">
          <p className="muted">Loading your projects…</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section eyebrow="Projects" title="My projects">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55 dark:text-white/50">
                Total
              </div>
              <div className="mt-2 text-3xl font-semibold text-ink dark:text-white">{stats.total}</div>
            </div>
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 dark:text-gray-400">
                Application
              </div>
              <div className="mt-2 text-3xl font-semibold text-black dark:text-white">
                {stats.applicationInProgress}
              </div>
            </div>
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 dark:text-gray-400">
                Discussion
              </div>
              <div className="mt-2 text-3xl font-semibold text-black dark:text-white">
                {stats.discussionInProgress}
              </div>
            </div>
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 dark:text-gray-400">
                Development
              </div>
              <div className="mt-2 text-3xl font-semibold text-black dark:text-white">
                {stats.developmentInProgress}
              </div>
            </div>
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 dark:text-gray-400">
                Succeeded
              </div>
              <div className="mt-2 text-3xl font-semibold text-black dark:text-white">
                {stats.succeeded}
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid gap-4 md:grid-cols-5">
            <div className="card card-dark p-4 text-center">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.applicationInProgress}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Application in Progress</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.discussionInProgress}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Discussion in Progress</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.developmentInProgress}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Development in Progress</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.succeeded}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Succeeded</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.failed}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Failed</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`btn px-4 py-2 ${
                filter === "all"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("APPLICATION_IN_PROGRESS")}
              className={`btn px-4 py-2 ${
                filter === "APPLICATION_IN_PROGRESS"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Application in Progress
            </button>
            <button
              onClick={() => setFilter("DISCUSSION_IN_PROGRESS")}
              className={`btn px-4 py-2 ${
                filter === "DISCUSSION_IN_PROGRESS"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Discussion in Progress
            </button>
            <button
              onClick={() => setFilter("DEVELOPMENT_IN_PROGRESS")}
              className={`btn px-4 py-2 ${
                filter === "DEVELOPMENT_IN_PROGRESS"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Development in Progress
            </button>
            <button
              onClick={() => setFilter("SUCCEEDED")}
              className={`btn px-4 py-2 ${
                filter === "SUCCEEDED"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Succeeded
            </button>
            <button
              onClick={() => setFilter("FAILED")}
              className={`btn px-4 py-2 ${
                filter === "FAILED"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Failed
            </button>
            <Link
              href="/projects/new"
              className="btn btn-primary px-4 py-2"
            >
              + New Project
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-gray-50 border border-gray-300 p-4 text-sm text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              {error}
            </div>
          )}

          {/* Projects List */}
          {projects.length === 0 && !error ? (
            <div className="card card-dark p-12 text-center">
              <p className="muted">No projects found for this filter.</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

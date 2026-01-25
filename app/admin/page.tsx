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
  client: {
    name: string;
    email: string;
  };
  milestones?: Array<{
    id: string;
    status: string;
  }>;
};

export default function AdminPage() {
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
    pendingFeasibility: 0,
    pendingNegotiation: 0,
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
        pendingFeasibility: allProjects.filter((p: Project) => p.feasibilityStatus === "PENDING").length,
        pendingNegotiation: allProjects.filter((p: Project) => p.negotiationPending === "TEAM").length,
      };
      setStats(statsData);

      // Filter projects
      if (filter === "all") {
        setProjects(allProjects);
      } else if (filter === "pending-feasibility") {
        setProjects(allProjects.filter((p: Project) => p.feasibilityStatus === "PENDING"));
      } else if (filter === "pending-negotiation") {
        setProjects(allProjects.filter((p: Project) => p.negotiationPending === "TEAM"));
      } else if (filter === "needs-plan") {
        setProjects(
          allProjects.filter(
            (p: Project) =>
              p.status === "DISCUSSION_IN_PROGRESS" &&
              p.feasibilityStatus === "APPROVED" &&
              !p.developmentPlan &&
              !p.negotiationPending
          )
        );
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
      // Check if user is admin/developer
      if (session?.user?.role !== "ADMIN" && session?.user?.role !== "DEVELOPER") {
        router.push("/");
        return;
      }
      fetchProjects();
    }
  }, [status, session?.user?.role, router, fetchProjects]);

  // Listen for project status updates via WebSocket
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = onProjectUpdate((projectId) => {
      // Refresh the dashboard when any project updates
      fetchProjects();
    });

    return unsubscribe;
  }, [connected, onProjectUpdate, fetchProjects]);

  // Fallback polling when WebSocket is not available
  useEffect(() => {
    if (status !== "authenticated" || connected) return;
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "DEVELOPER") return;

    const pollInterval = setInterval(() => {
      fetchProjects();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [status, connected, session?.user?.role, fetchProjects]);

  if (status === "loading" || loading) {
    return (
      <Section eyebrow="Admin" title="Dashboard">
        <div className="card card-dark p-8">
          <p className="muted">Loading dashboard…</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section eyebrow="Admin" title="Dashboard">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55 dark:text-white/50">
                Total
              </div>
              <div className="mt-2 text-3xl font-semibold text-ink dark:text-white">{stats.total}</div>
            </div>
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 dark:text-gray-400">
                Feasibility
              </div>
              <div className="mt-2 text-3xl font-semibold text-black dark:text-white">
                {stats.pendingFeasibility}
              </div>
            </div>
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 dark:text-gray-400">
                Negotiation
              </div>
              <div className="mt-2 text-3xl font-semibold text-black dark:text-white">
                {stats.pendingNegotiation}
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
              onClick={() => setFilter("pending-feasibility")}
              className={`btn px-4 py-2 ${
                filter === "pending-feasibility"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Pending Feasibility ({stats.pendingFeasibility})
            </button>
            <button
              onClick={() => setFilter("pending-negotiation")}
              className={`btn px-4 py-2 ${
                filter === "pending-negotiation"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Pending Negotiation ({stats.pendingNegotiation})
            </button>
            <button
              onClick={() => setFilter("needs-plan")}
              className={`btn px-4 py-2 ${
                filter === "needs-plan"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              Needs Development Plan
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
                <div key={project.id} className="relative group">
                  <ProjectCard project={project} />
                  {/* Quick Action Buttons - Positioned below the card content */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {project.feasibilityStatus === "PENDING" && (
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Review Feasibility
                      </Link>
                    )}
                    {project.negotiationPending === "TEAM" && (
                      <Link
                        href={`/projects/${project.id}/plan`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Respond to Negotiation
                      </Link>
                    )}
                    {project.status === "DISCUSSION_IN_PROGRESS" &&
                      project.feasibilityStatus === "APPROVED" &&
                      !project.developmentPlan &&
                      !project.negotiationPending && (
                        <Link
                          href={`/projects/${project.id}/plan`}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          Create Plan
                        </Link>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

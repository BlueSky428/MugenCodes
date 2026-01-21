"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    applicationInProgress: 0,
    discussionInProgress: 0,
    developmentInProgress: 0,
    approved: 0,
    failed: 0,
    pendingFeasibility: 0,
    pendingNegotiation: 0,
  });

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch projects");
        setLoading(false);
        return;
      }

      const allProjects = data.projects || [];
      
      setProjects(allProjects);

      // Calculate statistics
      const statsData = {
        total: allProjects.length,
        applicationInProgress: allProjects.filter((p: Project) => p.status === "APPLICATION_IN_PROGRESS").length,
        discussionInProgress: allProjects.filter((p: Project) => p.status === "DISCUSSION_IN_PROGRESS").length,
        developmentInProgress: allProjects.filter((p: Project) => p.status === "DEVELOPMENT_IN_PROGRESS").length,
        approved: allProjects.filter((p: Project) => p.status === "APPROVED").length,
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

  if (status === "loading" || loading) {
    return <Section title="Loading...">Please wait...</Section>;
  }

  return (
    <>
      <Section title="Admin Dashboard">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-nightSoft">
              <div className="text-sm text-ink/70 dark:text-white/70">Total Projects</div>
              <div className="mt-2 text-3xl font-semibold text-ink dark:text-white">{stats.total}</div>
            </div>
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="text-sm text-blue-700 dark:text-blue-400">Pending Feasibility Review</div>
              <div className="mt-2 text-3xl font-semibold text-blue-800 dark:text-blue-300">
                {stats.pendingFeasibility}
              </div>
            </div>
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="text-sm text-yellow-700 dark:text-yellow-400">Pending Negotiation</div>
              <div className="mt-2 text-3xl font-semibold text-yellow-800 dark:text-yellow-300">
                {stats.pendingNegotiation}
              </div>
            </div>
            <div className="rounded-3xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
              <div className="text-sm text-green-700 dark:text-green-400">In Development</div>
              <div className="mt-2 text-3xl font-semibold text-green-800 dark:text-green-300">
                {stats.developmentInProgress}
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid gap-4 md:grid-cols-5">
            <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center dark:border-white/10 dark:bg-nightSoft">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.applicationInProgress}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Application in Progress</div>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center dark:border-white/10 dark:bg-nightSoft">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.discussionInProgress}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Discussion in Progress</div>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center dark:border-white/10 dark:bg-nightSoft">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.developmentInProgress}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Development in Progress</div>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center dark:border-white/10 dark:bg-nightSoft">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.approved}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Approved</div>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4 text-center dark:border-white/10 dark:bg-nightSoft">
              <div className="text-2xl font-semibold text-ink dark:text-white">{stats.failed}</div>
              <div className="text-xs text-ink/70 dark:text-white/70 mt-1">Failed</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "all"
                  ? "bg-accent text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("pending-feasibility")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "pending-feasibility"
                  ? "bg-blue-500 text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Pending Feasibility ({stats.pendingFeasibility})
            </button>
            <button
              onClick={() => setFilter("pending-negotiation")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "pending-negotiation"
                  ? "bg-yellow-500 text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Pending Negotiation ({stats.pendingNegotiation})
            </button>
            <button
              onClick={() => setFilter("needs-plan")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "needs-plan"
                  ? "bg-purple-500 text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Needs Development Plan
            </button>
            <button
              onClick={() => setFilter("APPLICATION_IN_PROGRESS")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "APPLICATION_IN_PROGRESS"
                  ? "bg-accent text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Application in Progress
            </button>
            <button
              onClick={() => setFilter("DISCUSSION_IN_PROGRESS")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "DISCUSSION_IN_PROGRESS"
                  ? "bg-accent text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Discussion in Progress
            </button>
            <button
              onClick={() => setFilter("DEVELOPMENT_IN_PROGRESS")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "DEVELOPMENT_IN_PROGRESS"
                  ? "bg-accent text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Development in Progress
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "APPROVED"
                  ? "bg-accent text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("FAILED")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === "FAILED"
                  ? "bg-accent text-white"
                  : "border border-ink/20 bg-white text-ink hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40"
              }`}
            >
              Failed
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Projects List */}
          {projects.length === 0 && !error ? (
            <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center dark:border-white/10 dark:bg-nightSoft">
              <p className="text-ink/70 dark:text-white/70">No projects found for this filter.</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="relative">
                  <ProjectCard project={project} />
                  {/* Quick Action Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {project.feasibilityStatus === "PENDING" && (
                      <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-600"
                      >
                        Review Feasibility
                      </Link>
                    )}
                    {project.negotiationPending === "TEAM" && (
                      <Link
                        href={`/projects/${project.id}/plan`}
                        className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-yellow-600"
                      >
                        Respond to Negotiation
                      </Link>
                    )}
                    {project.status === "DISCUSSION_IN_PROGRESS" &&
                      project.feasibilityStatus === "APPROVED" &&
                      !project.developmentPlan &&
                      !project.negotiationPending && (
                        <Link
                          href={`/projects/${project.id}/plan`}
                          className="inline-flex items-center rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-purple-600"
                        >
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

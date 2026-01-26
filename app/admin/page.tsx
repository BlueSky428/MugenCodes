"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { useGlobalSocket } from "@/lib/useGlobalSocket";
import { projectStatusTextColors } from "@/lib/status";

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
    id: string;
    name: string;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedProject(null);
        fetchProjects(); // Refresh the list
      } else {
        const data = await response.json();
        setDeleteError(data.error || "Failed to delete project. Please try again.");
      }
    } catch (err) {
      setDeleteError("An error occurred. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
              <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${projectStatusTextColors.DEVELOPMENT_IN_PROGRESS} opacity-70`}>
                Development
              </div>
              <div className={`mt-2 text-3xl font-semibold ${projectStatusTextColors.DEVELOPMENT_IN_PROGRESS}`}>
                {stats.developmentInProgress}
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid gap-4 md:grid-cols-5">
            <div className="card card-dark p-4 text-center">
              <div className={`text-2xl font-semibold ${projectStatusTextColors.APPLICATION_IN_PROGRESS}`}>{stats.applicationInProgress}</div>
              <div className={`text-xs ${projectStatusTextColors.APPLICATION_IN_PROGRESS} opacity-70 mt-1`}>Application in Progress</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className={`text-2xl font-semibold ${projectStatusTextColors.DISCUSSION_IN_PROGRESS}`}>{stats.discussionInProgress}</div>
              <div className={`text-xs ${projectStatusTextColors.DISCUSSION_IN_PROGRESS} opacity-70 mt-1`}>Discussion in Progress</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className={`text-2xl font-semibold ${projectStatusTextColors.DEVELOPMENT_IN_PROGRESS}`}>{stats.developmentInProgress}</div>
              <div className={`text-xs ${projectStatusTextColors.DEVELOPMENT_IN_PROGRESS} opacity-70 mt-1`}>Development in Progress</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className={`text-2xl font-semibold ${projectStatusTextColors.SUCCEEDED}`}>{stats.succeeded}</div>
              <div className={`text-xs ${projectStatusTextColors.SUCCEEDED} opacity-70 mt-1`}>Succeeded</div>
            </div>
            <div className="card card-dark p-4 text-center">
              <div className={`text-2xl font-semibold ${projectStatusTextColors.FAILED}`}>{stats.failed}</div>
              <div className={`text-xs ${projectStatusTextColors.FAILED} opacity-70 mt-1`}>Failed</div>
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
              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                filter === "APPLICATION_IN_PROGRESS"
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "btn-secondary"
              }`}
            >
              Application in Progress
            </button>
            <button
              onClick={() => setFilter("DISCUSSION_IN_PROGRESS")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                filter === "DISCUSSION_IN_PROGRESS"
                  ? "bg-warning-500 text-white hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700"
                  : "btn-secondary"
              }`}
            >
              Discussion in Progress
            </button>
            <button
              onClick={() => setFilter("DEVELOPMENT_IN_PROGRESS")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                filter === "DEVELOPMENT_IN_PROGRESS"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : "btn-secondary"
              }`}
            >
              Development in Progress
            </button>
            <button
              onClick={() => setFilter("SUCCEEDED")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                filter === "SUCCEEDED"
                  ? "bg-success-600 text-white hover:bg-success-700 dark:bg-success-500 dark:hover:bg-success-600"
                  : "btn-secondary"
              }`}
            >
              Succeeded
            </button>
            <button
              onClick={() => setFilter("FAILED")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                filter === "FAILED"
                  ? "bg-error-600 text-white hover:bg-error-700 dark:bg-error-500 dark:hover:bg-error-600"
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
                  {/* Delete button for failed projects */}
                  {project.status === "FAILED" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(project);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-error-100 text-error-600 hover:bg-error-200 dark:bg-error-900/30 dark:text-error-400 dark:hover:bg-error-900/50 transition-colors opacity-0 group-hover:opacity-100 z-10"
                      title="Delete Project"
                      aria-label="Delete Project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
            setDeleteError("");
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in-up border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Project: <span className="font-medium text-gray-900 dark:text-white">{selectedProject.name}</span>
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to permanently delete this failed project? This action cannot be undone and all project data will be removed.
            </p>
            
            {deleteError && (
              <div className="rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 p-3 text-sm text-error-700 dark:text-error-400 mb-4">
                {deleteError}
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProject(null);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-error-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { useGlobalSocket } from "@/lib/useGlobalSocket";
import { ProjectCardSkeleton } from "@/components/LoadingSkeleton";
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
  totalPaid?: number;
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [cancelError, setCancelError] = useState("");

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

  const handleCancelClick = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowCancelModal(true);
      setCancelReason("");
      setCancelError("");
    }
  };

  const handleCancelProject = async () => {
    if (!selectedProject || !cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }

    setCancelError("");
    setSubmittingCancel(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}/fail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason.trim() }),
      });

      if (response.ok) {
        setShowCancelModal(false);
        setSelectedProject(null);
        setCancelReason("");
        fetchProjects(); // Refresh the list
      } else {
        const data = await response.json();
        setCancelError(data.error || "Failed to cancel project. Please try again.");
      }
    } catch (err) {
      setCancelError("An error occurred. Please try again.");
    } finally {
      setSubmittingCancel(false);
    }
  };

  const isClient = session?.user?.role === "CLIENT";
  const canCancelProject = (project: Project) => {
    if (!isClient) return false;
    return (
      project.status === "APPLICATION_IN_PROGRESS" ||
      project.status === "DISCUSSION_IN_PROGRESS" ||
      project.status === "DEVELOPMENT_IN_PROGRESS"
    );
  };

  if (status === "loading" || loading) {
    return (
      <Section eyebrow="Projects" title="My projects">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card card-dark p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section eyebrow="Projects" title="My projects">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="card card-dark p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55 dark:text-white/50">
                Total
              </div>
              <div className="mt-2 text-3xl font-semibold text-ink dark:text-white">{stats.total}</div>
            </div>
            <div className="card card-dark p-6">
              <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${projectStatusTextColors.APPLICATION_IN_PROGRESS} opacity-70`}>
                Application
              </div>
              <div className={`mt-2 text-3xl font-semibold ${projectStatusTextColors.APPLICATION_IN_PROGRESS}`}>
                {stats.applicationInProgress}
              </div>
            </div>
            <div className="card card-dark p-6">
              <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${projectStatusTextColors.DISCUSSION_IN_PROGRESS} opacity-70`}>
                Discussion
              </div>
              <div className={`mt-2 text-3xl font-semibold ${projectStatusTextColors.DISCUSSION_IN_PROGRESS}`}>
                {stats.discussionInProgress}
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
            <div className="card card-dark p-6">
              <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${projectStatusTextColors.SUCCEEDED} opacity-70`}>
                Succeeded
              </div>
              <div className={`mt-2 text-3xl font-semibold ${projectStatusTextColors.SUCCEEDED}`}>
                {stats.succeeded}
              </div>
            </div>
            <div className="card card-dark p-6">
              <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${projectStatusTextColors.FAILED} opacity-70`}>
                Failed
              </div>
              <div className={`mt-2 text-3xl font-semibold ${projectStatusTextColors.FAILED}`}>
                {stats.failed}
              </div>
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  onCancel={handleCancelClick}
                  canCancel={canCancelProject(project)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      {/* Cancel Project Modal */}
      {showCancelModal && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setShowCancelModal(false);
            setSelectedProject(null);
            setCancelReason("");
            setCancelError("");
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in-up border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cancel Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Project: <span className="font-medium text-gray-900 dark:text-white">{selectedProject.name}</span>
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              {selectedProject.status === "APPLICATION_IN_PROGRESS" && (selectedProject.totalPaid === 0 || !selectedProject.totalPaid) ? (
                <>
                  Are you sure you want to cancel this project? Since no payment has been made, this project will be <span className="font-semibold text-red-600 dark:text-red-400">permanently deleted</span> from your project list. This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to cancel this project? This action cannot be undone and the project will be moved to the failed projects list.
                </>
              )}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please provide a reason for cancelling this project..."
                />
              </div>
              
              {cancelError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
                  {cancelError}
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedProject(null);
                    setCancelReason("");
                    setCancelError("");
                  }}
                  disabled={submittingCancel}
                  className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelProject}
                  disabled={submittingCancel || !cancelReason.trim()}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingCancel ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

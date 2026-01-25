"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";
import Link from "next/link";
import { ProjectChat } from "@/components/ProjectChat";
import { useSocket } from "@/lib/useSocket";
import { formatProjectStatus, formatFeasibilityStatus, feasibilityStatusColors, projectStatusColors, projectStatusIcons, projectStatusTextColors } from "@/lib/status";

type Project = {
  id: string;
  name: string;
  requirements: string;
  developmentCost: number;
  deadline: string;
  status: string;
  feasibilityStatus: string;
  feasibilityReason?: string;
  developmentPlan?: string;
  failureReason?: string;
  failureResponsibility?: string;
  totalPaid: number;
  negotiationPending?: string | null;
  negotiationMessage?: string | null;
  negotiationRequestedAt?: string | null;
  client: {
    name: string;
    email: string;
  };
  milestones: Array<{
    id: string;
    name: string;
    description?: string;
    amount: number;
    dueDate: string;
    status: string;
    paidAt?: string;
  }>;
  review?: {
    rating: number;
    comment?: string;
    createdAt: string;
  };
  updates: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }>;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { socket, connected } = useSocket(params.id as string);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFeasibilityReview, setShowFeasibilityReview] = useState(false);
  const [feasibilityStatus, setFeasibilityStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [feasibilityReason, setFeasibilityReason] = useState("");
  const [submittingFeasibility, setSubmittingFeasibility] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [actionError, setActionError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [showMilestonePaidModal, setShowMilestonePaidModal] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/projects/${params.id}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load project");
        setProject(null);
        return;
      }

      setProject(data.project);
    } catch (err) {
      setError("An error occurred while loading the project");
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (sessionStatus === "authenticated") {
      fetchProject();
    }
  }, [sessionStatus, router, fetchProject]);

  // Listen for project refresh and status changes via WebSocket (when enabled)
  useEffect(() => {
    if (!socket || !connected) return;

    const handleRefreshProject = async (projectId: string) => {
      if (projectId === params.id) {
        // Fetch updated project data
        fetchProject();
      }
    };

    const handleStatusUpdate = (data: { projectId: string; status?: string; project?: any }) => {
      if (data.projectId === params.id) {
        if (data.project) {
          // Update project immediately with received data
          setProject(data.project);
        } else {
          // Fetch updated project data if full project not provided
          fetchProject();
        }
      }
    };

    socket.on("refresh-project", handleRefreshProject);
    socket.on("project-status-updated", handleStatusUpdate);

    return () => {
      socket.off("refresh-project", handleRefreshProject);
      socket.off("project-status-updated", handleStatusUpdate);
    };
  }, [socket, connected, params.id, fetchProject]);

  // Fallback polling for project updates (if WebSocket fails)
  useEffect(() => {
    if (sessionStatus !== "authenticated" || !params.id || loading || (socket && connected)) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`, {
          cache: 'no-store',
        });
        const data = await response.json();

        if (response.ok && data.project) {
          setProject((prevProject) => {
            if (!prevProject) return data.project;
            
            const prevUpdateIds = new Set(prevProject.updates.map(u => u.id));
            const newUpdates = data.project.updates.filter((u: any) => !prevUpdateIds.has(u.id));
            
            const milestonesChanged = prevProject.milestones.some((m, idx) => {
              const newM = data.project.milestones[idx];
              return !newM || m.status !== newM.status || m.paidAt !== newM.paidAt;
            }) || prevProject.milestones.length !== data.project.milestones.length;
            
            const statusChanged = prevProject.status !== data.project.status;
            const paymentChanged = prevProject.totalPaid !== data.project.totalPaid;
            const planChanged = prevProject.developmentPlan !== data.project.developmentPlan;
            const negotiationChanged = 
              prevProject.negotiationPending !== data.project.negotiationPending ||
              prevProject.negotiationMessage !== data.project.negotiationMessage;
            
            if (newUpdates.length > 0 || milestonesChanged || statusChanged || paymentChanged || planChanged || negotiationChanged) {
              return data.project;
            }
            
            return prevProject;
          });
        }
      } catch (err) {
        console.error("Error polling project updates:", err);
      }
    }, 5000); // Poll every 5 seconds as fallback

    return () => {
      clearInterval(pollInterval);
    };
  }, [sessionStatus, params.id, loading, socket, connected]);

  const handleFeasibilityReview = async () => {
    if (feasibilityStatus === "REJECTED" && !feasibilityReason.trim()) {
      setActionError("Please provide a reason for rejection");
      return;
    }

    setActionError("");
    setSubmittingFeasibility(true);
    try {
      const response = await fetch(`/api/projects/${params.id}/feasibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: feasibilityStatus,
          reason: feasibilityStatus === "REJECTED" ? feasibilityReason : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || "Failed to review feasibility. Please try again.");
        return;
      }

      setShowFeasibilityReview(false);
      setFeasibilityReason("");
      setActionError("");
      // Refresh project data immediately
      await fetchProject();
      router.refresh();
    } catch (err) {
      setActionError("An error occurred. Please try again.");
    } finally {
      setSubmittingFeasibility(false);
    }
  };

  const handlePostUpdate = async () => {
    if (!updateTitle.trim() || !updateContent.trim()) {
      setActionError("Please provide both title and content");
      return;
    }

    setActionError("");
    setSubmittingUpdate(true);
    try {
      const response = await fetch(`/api/projects/${params.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updateTitle.trim(),
          content: updateContent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || "Failed to post update. Please try again.");
        return;
      }

      setShowUpdateForm(false);
      setUpdateTitle("");
      setUpdateContent("");
      setActionError("");
      router.refresh();
      fetchProject();
    } catch (err) {
      setActionError("An error occurred. Please try again.");
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleMarkMilestonePaid = async (milestoneId: string) => {
    setShowMilestonePaidModal(milestoneId);
  };

  const confirmMarkMilestonePaid = async () => {
    if (!showMilestonePaidModal) return;

    setActionError("");
    try {
      const response = await fetch(`/api/projects/${params.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId: showMilestonePaidModal,
          paymentConfirmed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || "Failed to mark milestone as paid. Please try again.");
        setShowMilestonePaidModal(null);
        return;
      }

      setShowMilestonePaidModal(null);
      setActionError("");
      router.refresh();
      fetchProject();
    } catch (err) {
      setActionError("An error occurred. Please try again.");
      setShowMilestonePaidModal(null);
    }
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <Section eyebrow="Project" title="Loading">
        <div className="card card-dark p-8">
          <p className="muted">Loading project…</p>
        </div>
      </Section>
    );
  }

  if (error || !project) {
    return (
      <Section title="Error">
        <p>{error || "Project not found"}</p>
      </Section>
    );
  }

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "DEVELOPER";
  const isClient = session?.user?.role === "CLIENT";
  const canApprove = isClient && project.status === "DISCUSSION_IN_PROGRESS" && project.developmentPlan && project.negotiationPending === "CLIENT";
  const canReview = isClient && project.status === "SUCCEEDED" && !project.review;
  // Clients can cancel in APPLICATION_IN_PROGRESS, DISCUSSION_IN_PROGRESS, or DEVELOPMENT_IN_PROGRESS
  // Admins/Developers can only cancel during DEVELOPMENT_IN_PROGRESS
  const canCancel = isClient && (
    project.status === "APPLICATION_IN_PROGRESS" ||
    project.status === "DISCUSSION_IN_PROGRESS" ||
    project.status === "DEVELOPMENT_IN_PROGRESS"
  ) || (isAdmin && project.status === "DEVELOPMENT_IN_PROGRESS");
  const canRespondToNegotiation = isAdmin && project.status === "DISCUSSION_IN_PROGRESS" && project.negotiationPending === "TEAM";
  const canReviewFeasibility = isAdmin && project.feasibilityStatus === "PENDING";
  const canCreatePlan = isAdmin && project.feasibilityStatus === "APPROVED" && project.status === "DISCUSSION_IN_PROGRESS" && !project.developmentPlan && !project.negotiationPending;
  const canPostUpdate = isAdmin && project.status === "DEVELOPMENT_IN_PROGRESS";

  return (
    <>
      <Section eyebrow="Project" title={project.name}>
        <div className="space-y-8">
          {/* Action Error Display */}
          {actionError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <div className="flex items-start justify-between">
                <p>{actionError}</p>
                <button
                  onClick={() => setActionError("")}
                  className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {/* Project Info */}
          <div className="card card-dark p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                  Project Details
                </h3>
                <div className="space-y-2 text-sm muted">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-ink dark:text-white">Status:</span>
                    {project && (() => {
                      const StatusIcon = projectStatusIcons[project.status] || projectStatusIcons.APPLICATION_IN_PROGRESS;
                      return (
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                            projectStatusColors[project.status] || projectStatusColors.APPLICATION_IN_PROGRESS
                          }`}
                          title={formatProjectStatus(project.status)}
                        >
                          <StatusIcon className={`w-6 h-6 ${
                            project.status === "APPLICATION_IN_PROGRESS" ? "text-blue-600 dark:text-blue-400" :
                            project.status === "DISCUSSION_IN_PROGRESS" ? "text-warning-600 dark:text-warning-400" :
                            project.status === "DEVELOPMENT_IN_PROGRESS" ? "text-indigo-600 dark:text-indigo-400" :
                            project.status === "SUCCEEDED" ? "text-success-600 dark:text-success-400" :
                            project.status === "FAILED" ? "text-error-600 dark:text-error-400" :
                            "text-primary-600 dark:text-primary-400"
                          }`} />
                        </div>
                      );
                    })()}
                    <span className={`text-sm font-medium ${projectStatusTextColors[project.status] || "text-ink/70 dark:text-white/70"}`}>
                      {project && formatProjectStatus(project.status)}
                    </span>
                  </div>
                  <p>
                    <span className="font-medium">Cost:</span> ${project.developmentCost.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Deadline:</span>{" "}
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Total Paid:</span> ${project.totalPaid.toLocaleString()}
                  </p>
                  {isAdmin && (
                    <p>
                      <span className="font-medium">Client:</span> {project.client.name} ({project.client.email})
                    </p>
                  )}
                </div>
              </div>

              {project.feasibilityStatus && (
                <div>
                  <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                    Feasibility Status
                  </h3>
                  <div className="space-y-2 text-sm muted">
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        feasibilityStatusColors[project.feasibilityStatus] || ""
                      }`}>
                        {formatFeasibilityStatus(project.feasibilityStatus)}
                      </span>
                    </p>
                    {project.feasibilityReason && (
                      <p>
                        <span className="font-medium">Reason:</span> {project.feasibilityReason}
                      </p>
                    )}
                  </div>
                  {canReviewFeasibility && !showFeasibilityReview && (
                    <button
                      onClick={() => setShowFeasibilityReview(true)}
                      className="mt-4 btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Review Feasibility
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="card card-dark p-8">
            <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
              Project Requirements
            </h3>
            <p className="text-base muted leading-relaxed whitespace-pre-wrap">
              {project.requirements}
            </p>
          </div>

          {/* Negotiation Status */}
          {project.negotiationPending && (
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8 dark:border-yellow-800 dark:bg-yellow-900/20">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
                Negotiation Status
              </h3>
              <div className="space-y-3">
                <p className="text-base text-yellow-700 dark:text-yellow-300">
                  <span className="font-medium">Waiting for:</span> {project.negotiationPending === "CLIENT" ? "Client Response" : "Team Response"}
                </p>
                {project.negotiationMessage && (
                  <div className="mt-3 p-4 bg-white/50 dark:bg-night/50 rounded-2xl">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Negotiation Request:</p>
                    <p className="text-base text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">
                      {project.negotiationMessage}
                    </p>
                  </div>
                )}
                {project.negotiationRequestedAt && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Requested on: {new Date(project.negotiationRequestedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Feasibility Review Form */}
          {showFeasibilityReview && (
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 dark:border-blue-800 dark:bg-blue-900/20">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4">
                Review Project Feasibility
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                    Decision
                  </label>
                  <select
                    value={feasibilityStatus}
                    onChange={(e) => setFeasibilityStatus(e.target.value as "APPROVED" | "REJECTED")}
                    className="w-full rounded-2xl border border-blue-300 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-600 dark:bg-night dark:text-white"
                  >
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </div>
                {feasibilityStatus === "REJECTED" && (
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                      Reason for Rejection (Required)
                    </label>
                    <textarea
                      value={feasibilityReason}
                      onChange={(e) => setFeasibilityReason(e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-blue-300 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-600 dark:bg-night dark:text-white"
                      placeholder="Explain why this project is not feasible..."
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleFeasibilityReview}
                    disabled={submittingFeasibility}
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submittingFeasibility ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    onClick={() => {
                      setShowFeasibilityReview(false);
                      setFeasibilityReason("");
                    }}
                    disabled={submittingFeasibility}
                    className="inline-flex items-center justify-center rounded-full border border-blue-300 bg-white px-6 py-3 text-base font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-50 dark:border-blue-600 dark:bg-night dark:text-blue-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Development Plan */}
          {project.developmentPlan && (
            <div className="card card-dark p-8">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                Development Plan
              </h3>
              <p className="text-base muted leading-relaxed whitespace-pre-wrap">
                {project.developmentPlan}
              </p>
            </div>
          )}

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <div className="card card-dark p-8">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                Milestones
              </h3>
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="rounded-2xl border border-ink/10 bg-surface p-6 dark:border-white/10 dark:bg-night"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-base font-semibold text-ink dark:text-white">
                          {index + 1}. {milestone.name}
                        </h4>
                        {milestone.description && (
                          <p className="text-sm text-ink/70 dark:text-white/70 mt-1">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          milestone.status === "PAID"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : milestone.status === "OVERDUE"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}
                      >
                        {milestone.status === "PAID" ? "Paid" : milestone.status === "OVERDUE" ? "Overdue" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-ink/70 dark:text-white/70">
                      <span>Amount: ${milestone.amount.toLocaleString()}</span>
                      <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                    </div>
                    {milestone.paidAt && (
                      <p className="text-xs text-ink/50 dark:text-white/50 mt-2">
                        Paid on: {new Date(milestone.paidAt).toLocaleDateString()}
                      </p>
                    )}
                    {isAdmin && milestone.status !== "PAID" && project.status === "DEVELOPMENT_IN_PROGRESS" && (
                      <button
                        onClick={() => handleMarkMilestonePaid(milestone.id)}
                        className="mt-3 btn px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Updates */}
          <div className="card card-dark p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink dark:text-white">
                Development Updates
              </h3>
              {canPostUpdate && !showUpdateForm && (
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="btn btn-primary px-4 py-2"
                >
                  Post Update
                </button>
              )}
            </div>
            {showUpdateForm && (
              <div className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h4 className="text-base font-semibold text-ink dark:text-white mb-4">
                  Create New Update
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink dark:text-white mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      className="input"
                      placeholder="Update title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink dark:text-white mb-2">
                      Content
                    </label>
                    <textarea
                      value={updateContent}
                      onChange={(e) => setUpdateContent(e.target.value)}
                      rows={5}
                      className="textarea"
                      placeholder="Describe the development progress..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePostUpdate}
                      disabled={submittingUpdate}
                      className="btn btn-primary px-6 py-3 text-base rounded-2xl"
                    >
                      {submittingUpdate ? "Posting..." : "Post Update"}
                    </button>
                    <button
                      onClick={() => {
                        setShowUpdateForm(false);
                        setUpdateTitle("");
                        setUpdateContent("");
                      }}
                      disabled={submittingUpdate}
                      className="btn btn-secondary px-6 py-3 text-base rounded-2xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {project.updates.length > 0 ? (
              <div className="space-y-4">
                {project.updates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-2xl border border-ink/10 bg-surface p-6 dark:border-white/10 dark:bg-night"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base font-semibold text-ink dark:text-white">
                        {update.title}
                      </h4>
                      <span className="text-xs text-ink/50 dark:text-white/50">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-ink/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                      {update.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/50 dark:text-white/50">
                No updates yet.
              </p>
            )}
          </div>

          {/* Review */}
          {project.review && (
            <div className="card card-dark p-8">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                Client Review
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink dark:text-white">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < project.review!.rating
                            ? "text-yellow-400"
                            : "text-ink/20 dark:text-white/20"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {project.review.comment && (
                  <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
                    {project.review.comment}
                  </p>
                )}
                <p className="text-xs text-ink/50 dark:text-white/50">
                  Reviewed on: {new Date(project.review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Failure Info */}
          {project.failureReason && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
                Project Failure Details
              </h3>
              <div className="space-y-2 text-sm text-red-700 dark:text-red-400">
                <p>
                  <span className="font-medium">Reason:</span> {project.failureReason}
                </p>
                {project.failureResponsibility && (
                  <p>
                    <span className="font-medium">Responsibility:</span> {project.failureResponsibility}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {isAdmin && (
              <>
                {canReviewFeasibility && (
                  <button
                    onClick={() => setShowFeasibilityReview(true)}
                    className="inline-flex items-center gap-2 justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Review Feasibility
                  </button>
                )}
                {canCreatePlan && (
                  <Link
                    href={`/projects/${project.id}/plan`}
                    className="inline-flex items-center gap-2 justify-center rounded-xl bg-gradient-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Create Development Plan
                  </Link>
                )}
                {canRespondToNegotiation && (
                  <Link
                    href={`/projects/${project.id}/plan`}
                    className="inline-flex items-center gap-2 justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Respond to Re-negotiation Request
                  </Link>
                )}
              </>
            )}
            {canApprove && (
              <Link
                href={`/projects/${project.id}/approve`}
                className="inline-flex items-center gap-2 justify-center rounded-xl bg-gradient-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Respond to Milestone Proposal
              </Link>
            )}
            {canCancel && (
              <>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center gap-2 justify-center rounded-xl border-2 border-red-400 bg-red-50 px-6 py-3 text-base font-semibold text-red-700 shadow-md transition-all duration-300 hover:bg-red-100 hover:shadow-lg hover:scale-105 active:scale-95 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Project
                </button>
              </>
            )}
            {canReview && (
              <Link
                href={`/projects/${project.id}/review`}
                className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 dark:border-white/20 dark:text-white dark:hover:border-white/40"
              >
                Submit Review
              </Link>
            )}
          </div>

          {/* Cancel Project Modal */}
          {showCancelModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
              onClick={() => {
                setShowCancelModal(false);
                setCancelReason("");
                setActionError("");
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
                      Project: <span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  {project.status === "APPLICATION_IN_PROGRESS" && project.totalPaid === 0 ? (
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
                  
                  {actionError && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
                      {actionError}
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowCancelModal(false);
                        setCancelReason("");
                        setActionError("");
                      }}
                      disabled={submittingCancel}
                      className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={async () => {
                        if (!cancelReason.trim()) {
                          setActionError("Please provide a reason for cancellation");
                          return;
                        }
                        setActionError("");
                        setSubmittingCancel(true);
                        try {
                          const response = await fetch(`/api/projects/${project.id}/fail`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ reason: cancelReason.trim() }),
                          });
                          if (response.ok) {
                            const data = await response.json();
                            setShowCancelModal(false);
                            setCancelReason("");
                            
                            // If project was deleted (application stage with no payment), redirect to projects list
                            if (data.deleted) {
                              router.push("/projects");
                            } else {
                              // Project was marked as failed, refresh the page
                              router.refresh();
                              fetchProject();
                            }
                          } else {
                            const data = await response.json();
                            setActionError(data.error || "Failed to cancel project. Please try again.");
                          }
                        } catch (err) {
                          setActionError("An error occurred. Please try again.");
                        } finally {
                          setSubmittingCancel(false);
                        }
                      }}
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

          {/* Mark Milestone Paid Modal */}
          {showMilestonePaidModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowMilestonePaidModal(null)}>
              <div className="w-full max-w-md card card-dark p-8" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-ink dark:text-white mb-4">
                  Mark Milestone as Paid
                </h3>
                <p className="text-sm text-ink/70 dark:text-white/70 mb-6">
                  Are you sure you want to mark this milestone as paid? This action will update the project status.
                </p>
                {actionError && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 mb-4">
                    {actionError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={confirmMarkMilestonePaid}
                    className="flex-1 inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-green-700"
                  >
                    Confirm Payment
                  </button>
                  <button
                    onClick={() => {
                      setShowMilestonePaidModal(null);
                      setActionError("");
                    }}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-ink/20 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 dark:border-white/20 dark:text-white dark:hover:border-white/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

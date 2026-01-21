"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";
import Link from "next/link";
import { ProjectChat } from "@/components/ProjectChat";
import { useSocket } from "@/lib/useSocket";

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

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (sessionStatus === "authenticated") {
      fetchProject();
    }
  }, [sessionStatus, params.id]);

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
  }, [socket, connected, params.id]);

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

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load project");
        return;
      }

      setProject(data.project);
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFeasibilityReview = async () => {
    if (feasibilityStatus === "REJECTED" && !feasibilityReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

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
        alert(data.error || "Failed to review feasibility");
        return;
      }

      setShowFeasibilityReview(false);
      setFeasibilityReason("");
      // Refresh project data immediately
      await fetchProject();
      router.refresh();
    } catch (err) {
      alert("An error occurred");
    } finally {
      setSubmittingFeasibility(false);
    }
  };

  const handlePostUpdate = async () => {
    if (!updateTitle.trim() || !updateContent.trim()) {
      alert("Please provide both title and content");
      return;
    }

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
        alert(data.error || "Failed to post update");
        return;
      }

      setShowUpdateForm(false);
      setUpdateTitle("");
      setUpdateContent("");
      router.refresh();
      fetchProject();
    } catch (err) {
      alert("An error occurred");
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleMarkMilestonePaid = async (milestoneId: string) => {
    if (!confirm("Mark this milestone as paid?")) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${params.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId,
          paymentConfirmed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to mark milestone as paid");
        return;
      }

      router.refresh();
      fetchProject();
    } catch (err) {
      alert("An error occurred");
    }
  };

  if (sessionStatus === "loading" || loading) {
    return <Section title="Loading...">Please wait...</Section>;
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
  const canReview = isClient && project.status === "APPROVED" && !project.review;
  const canCancel = (isClient || isAdmin) && project.status === "DEVELOPMENT_IN_PROGRESS";
  const canRespondToNegotiation = isAdmin && project.status === "DISCUSSION_IN_PROGRESS" && project.negotiationPending === "TEAM";
  const canReviewFeasibility = isAdmin && project.feasibilityStatus === "PENDING";
  const canCreatePlan = isAdmin && project.feasibilityStatus === "APPROVED" && project.status === "DISCUSSION_IN_PROGRESS" && !project.developmentPlan && !project.negotiationPending;
  const canPostUpdate = isAdmin && project.status === "DEVELOPMENT_IN_PROGRESS";

  return (
    <>
      <Section title={project.name}>
        <div className="space-y-8">
          {/* Project Info */}
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                  Project Details
                </h3>
                <div className="space-y-2 text-sm text-ink/70 dark:text-white/70">
                  <p>
                    <span className="font-medium">Status:</span> {project.status}
                  </p>
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
                  <div className="space-y-2 text-sm text-ink/70 dark:text-white/70">
                    <p>
                      <span className="font-medium">Status:</span> {project.feasibilityStatus}
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
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Review Feasibility
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
              Project Requirements
            </h3>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
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
            <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                Development Plan
              </h3>
              <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                {project.developmentPlan}
              </p>
            </div>
          )}

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
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
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}
                      >
                        {milestone.status}
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
                        className="mt-3 inline-flex items-center justify-center rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
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
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink dark:text-white">
                Development Updates
              </h3>
              {canPostUpdate && !showUpdateForm && (
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Post Update
                </button>
              )}
            </div>
            {showUpdateForm && (
              <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-6 dark:bg-accent/10">
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
                      className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/20 dark:bg-night dark:text-white"
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
                      className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/20 dark:bg-night dark:text-white"
                      placeholder="Describe the development progress..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePostUpdate}
                      disabled={submittingUpdate}
                      className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
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
                      className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 dark:border-white/20 dark:bg-night dark:text-white"
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
            <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
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
                    className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Review Feasibility
                  </button>
                )}
                {canCreatePlan && (
                  <Link
                    href={`/projects/${project.id}/plan`}
                    className="inline-flex items-center justify-center rounded-full bg-purple-500 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Create Development Plan
                  </Link>
                )}
                {canRespondToNegotiation && (
                  <Link
                    href={`/projects/${project.id}/plan`}
                    className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Respond to Re-negotiation Request
                  </Link>
                )}
              </>
            )}
            {canApprove && (
              <Link
                href={`/projects/${project.id}/approve`}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
              >
                Respond to Milestone Proposal
              </Link>
            )}
            {canCancel && (
              <button
                onClick={async () => {
                  const reason = prompt("Please provide a reason for cancelling this project:");
                  if (!reason || !reason.trim()) {
                    return;
                  }
                  if (!confirm("Are you sure you want to cancel this project? This action cannot be undone.")) {
                    return;
                  }
                  try {
                    const response = await fetch(`/api/projects/${project.id}/fail`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ reason: reason.trim() }),
                    });
                    if (response.ok) {
                      router.refresh();
                    } else {
                      const data = await response.json();
                      alert(data.error || "Failed to cancel project");
                    }
                  } catch (err) {
                    alert("An error occurred");
                  }
                }}
                className="inline-flex items-center justify-center rounded-full border border-red-300 bg-red-50 px-6 py-3 text-base font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Cancel Project
              </button>
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
        </div>
      </Section>
    </>
  );
}

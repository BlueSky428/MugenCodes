"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";

export default function ApproveProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showRenegotiate, setShowRenegotiate] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState("");

  const fetchProject = useCallback(async () => {
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
  }, [params.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProject();
    }
  }, [status, router, fetchProject]);

  const handleAction = async (action: "approve" | "reject" | "renegotiate") => {
    if (action === "approve") {
      if (!confirm("Are you sure you want to approve this project and make the upfront payment?")) {
        return;
      }
    } else if (action === "reject") {
      if (!confirm("Are you sure you want to reject this milestone proposal? This will cancel the project.")) {
        return;
      }
    } else if (action === "renegotiate") {
      if (!negotiationMessage.trim()) {
        setError("Please provide a message explaining what you'd like to change");
        return;
      }
      if (!confirm("Are you sure you want to request re-negotiation of the milestone?")) {
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${params.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          paymentConfirmed: action === "approve",
          message: action === "renegotiate" ? negotiationMessage : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to ${action} project`);
        return;
      }

      router.push(`/projects/${params.id}`);
      router.refresh();
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <Section eyebrow="Projects" title="Approve project">
        <div className="card card-dark p-8">
          <p className="muted">Loading…</p>
        </div>
      </Section>
    );
  }

  if (error || !project) {
    return (
      <Section eyebrow="Projects" title="Error">
        <div className="card card-dark p-8">
          <p className="muted">{error || "Project not found"}</p>
        </div>
      </Section>
    );
  }

  const firstMilestone = project.milestones?.[0];

  return (
    <>
      <Section eyebrow="Projects" title={`Approve project: ${project.name}`}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="card card-dark p-8">
            <div className="badge mb-4">Plan</div>
            <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">Development plan</h3>
            <p className="text-base muted leading-relaxed whitespace-pre-wrap">
              {project.developmentPlan || "No development plan available."}
            </p>
          </div>

          {firstMilestone && (
            <div className="card card-dark p-8">
              <div className="badge mb-4">Payment</div>
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">Upfront payment required</h3>
              <div className="space-y-2 text-base muted">
                <p>
                  <span className="font-medium">Milestone:</span> {firstMilestone.name}
                </p>
                {firstMilestone.description && (
                  <p>
                    <span className="font-medium">Description:</span> {firstMilestone.description}
                  </p>
                )}
                <p>
                  <span className="font-medium">Amount:</span> ${firstMilestone.amount.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Due Date:</span>{" "}
                  {new Date(firstMilestone.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {project.negotiationMessage && (
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                Negotiation Request
              </h3>
              <p className="text-base text-yellow-700 dark:text-yellow-300">
                {project.negotiationMessage}
              </p>
              {project.negotiationRequestedAt && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  Requested on: {new Date(project.negotiationRequestedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {showRenegotiate && (
            <div className="card card-dark p-6">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">Request re-negotiation</h3>
              <textarea
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                placeholder="Explain what changes you'd like to the milestone proposal..."
                className="textarea min-h-[120px]"
                rows={5}
              />
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleAction("approve")}
              disabled={submitting}
              className="btn btn-primary px-6 py-3 text-base rounded-2xl"
            >
              {submitting ? "Processing..." : "Approve & Make Payment"}
            </button>
            <button
              onClick={() => setShowRenegotiate(!showRenegotiate)}
              disabled={submitting}
              className="btn btn-secondary px-6 py-3 text-base rounded-2xl"
            >
              {showRenegotiate ? "Cancel Re-negotiation" : "Request Re-negotiation"}
            </button>
            {showRenegotiate && (
              <button
                onClick={() => handleAction("renegotiate")}
                disabled={submitting || !negotiationMessage.trim()}
                className="btn px-6 py-3 text-base rounded-2xl bg-yellow-500 text-white hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit Re-negotiation Request"}
              </button>
            )}
            <button
              onClick={() => handleAction("reject")}
              disabled={submitting}
              className="btn px-6 py-3 text-base rounded-2xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Reject & Cancel Project"}
            </button>
            <button
              onClick={() => router.back()}
              disabled={submitting}
              className="btn btn-ghost px-6 py-3 text-base rounded-2xl"
            >
              Back
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}

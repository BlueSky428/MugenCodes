"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProject();
    }
  }, [status]);

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
    return <Section title="Loading...">Please wait...</Section>;
  }

  if (error || !project) {
    return (
      <Section title="Error">
        <p>{error || "Project not found"}</p>
      </Section>
    );
  }

  const firstMilestone = project.milestones?.[0];

  return (
    <>
      <Section title={`Approve Project: ${project.name}`}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
              Development Plan
            </h3>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
              {project.developmentPlan || "No development plan available."}
            </p>
          </div>

          {firstMilestone && (
            <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                Upfront Payment Required
              </h3>
              <div className="space-y-2 text-base text-ink/70 dark:text-white/70">
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
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-nightSoft">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">
                Request Re-negotiation
              </h3>
              <textarea
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                placeholder="Explain what changes you'd like to the milestone proposal..."
                className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft min-h-[120px]"
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
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Approve & Make Payment"}
            </button>
            <button
              onClick={() => setShowRenegotiate(!showRenegotiate)}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 dark:border-white/20 dark:text-white dark:hover:border-white/40 disabled:opacity-50"
            >
              {showRenegotiate ? "Cancel Re-negotiation" : "Request Re-negotiation"}
            </button>
            {showRenegotiate && (
              <button
                onClick={() => handleAction("renegotiate")}
                disabled={submitting || !negotiationMessage.trim()}
                className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit Re-negotiation Request"}
              </button>
            )}
            <button
              onClick={() => handleAction("reject")}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full border border-red-300 bg-red-50 px-6 py-3 text-base font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Reject & Cancel Project"}
            </button>
            <button
              onClick={() => router.back()}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-white px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 dark:border-white/20 dark:text-white dark:hover:border-white/40 disabled:opacity-50"
            >
              Back
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}

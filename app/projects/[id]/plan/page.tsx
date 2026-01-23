"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";

export default function PlanProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showRenegotiate, setShowRenegotiate] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  const [milestones, setMilestones] = useState<Array<{ name: string; description: string; amount: string; dueDate: string }>>([{ name: "", description: "", amount: "", dueDate: "" }]);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load project");
        return;
      }

      setProject(data.project);
      if (data.project.developmentPlan) {
        setDevelopmentPlan(data.project.developmentPlan);
      }
      if (data.project.milestones && data.project.milestones.length > 0) {
        setMilestones(data.project.milestones.map((m: any) => ({
          name: m.name,
          description: m.description || "",
          amount: m.amount.toString(),
          dueDate: new Date(m.dueDate).toISOString().split("T")[0],
        })));
      }
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

  const addMilestone = () => {
    setMilestones([...milestones, { name: "", description: "", amount: "", dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    (updated[index] as any)[field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (action?: "approve" | "reject" | "renegotiate") => {
    if (!developmentPlan.trim()) {
      setError("Development plan is required");
      return;
    }

    if (milestones.length === 0 || milestones.some(m => !m.name || !m.amount || !m.dueDate)) {
      setError("All milestones must have name, amount, and due date");
      return;
    }

    const totalAmount = milestones.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);
    const costDifference = Math.abs(totalAmount - (project?.developmentCost || 0));
    if (costDifference > 0.01) {
      setError(`Milestone amounts must total $${project?.developmentCost.toLocaleString()}. Current total: $${totalAmount.toLocaleString()}`);
      return;
    }

    if (action === "renegotiate" && !negotiationMessage.trim()) {
      setError("Negotiation message is required");
      return;
    }

    if (action === "reject" && !negotiationMessage.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${params.id}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developmentPlan,
          milestones: milestones.map(m => ({
            name: m.name,
            description: m.description || null,
            amount: parseFloat(m.amount),
            dueDate: m.dueDate,
          })),
          action,
          message: action ? negotiationMessage : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save plan");
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
      <Section eyebrow="Projects" title="Development plan">
        <div className="card card-dark p-8">
          <p className="muted">Loading…</p>
        </div>
      </Section>
    );
  }

  if (error && !project) {
    return (
      <Section eyebrow="Projects" title="Error">
        <div className="card card-dark p-8">
          <p className="muted">{error}</p>
        </div>
      </Section>
    );
  }

  const isNegotiationResponse = project?.negotiationPending === "TEAM";
  const totalAmount = milestones.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);

  return (
    <>
      <Section
        eyebrow="Projects"
        title={isNegotiationResponse ? "Respond to re-negotiation request" : `Create development plan: ${project?.name}`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {isNegotiationResponse && project?.negotiationMessage && (
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                Client’s Re-negotiation Request
              </h3>
              <p className="text-base text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">
                {project.negotiationMessage}
              </p>
            </div>
          )}

          <div className="card card-dark p-8">
            <div className="badge mb-4">Plan</div>
            <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">Development plan</h3>
            <textarea
              value={developmentPlan}
              onChange={(e) => setDevelopmentPlan(e.target.value)}
              placeholder="Describe the development plan, approach, timeline, and key deliverables..."
              className="textarea min-h-[200px]"
              rows={10}
            />
          </div>

          <div className="card card-dark p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink dark:text-white">
                Milestones
              </h3>
              <div className="text-sm muted">
                Total: ${totalAmount.toLocaleString()} / ${project?.developmentCost.toLocaleString()}
              </div>
            </div>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="rounded-2xl border border-ink/10 bg-surface p-6 dark:border-white/10 dark:bg-night">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-base font-semibold text-ink dark:text-white">
                      Milestone {index + 1}
                    </h4>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink dark:text-white">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(index, "name", e.target.value)}
                        required
                        className="input py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink dark:text-white">
                        Amount ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                        required
                        className="input py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink dark:text-white">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                        required
                        className="input py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-ink dark:text-white">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, "description", e.target.value)}
                        className="input py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addMilestone}
                className="btn btn-secondary w-full py-3 rounded-2xl"
              >
                + Add Milestone
              </button>
            </div>
          </div>

          {isNegotiationResponse && (
            <div className="card card-dark p-6">
              <h3 className="text-lg font-semibold text-ink dark:text-white mb-4">Response options</h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleSubmit("approve")}
                  disabled={submitting}
                  className="btn btn-primary w-full py-3 text-base rounded-2xl"
                >
                  {submitting ? "Processing..." : "Approve Client's Request & Update Plan"}
                </button>
                <button
                  onClick={() => setShowRenegotiate(!showRenegotiate)}
                  disabled={submitting}
                  className="btn btn-secondary w-full py-3 text-base rounded-2xl"
                >
                  {showRenegotiate ? "Cancel Re-negotiation" : "Re-negotiate Back to Client"}
                </button>
                {showRenegotiate && (
                  <>
                    <textarea
                      value={negotiationMessage}
                      onChange={(e) => setNegotiationMessage(e.target.value)}
                      placeholder="Explain your counter-proposal..."
                      className="textarea min-h-[120px]"
                      rows={5}
                    />
                    <button
                      onClick={() => handleSubmit("renegotiate")}
                      disabled={submitting || !negotiationMessage.trim()}
                      className="btn w-full py-3 text-base rounded-2xl bg-yellow-500 text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Submit Re-negotiation"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    const reason = prompt("Please provide a reason for rejecting the client's request:");
                    if (reason && reason.trim()) {
                      setNegotiationMessage(reason.trim());
                      handleSubmit("reject");
                    }
                  }}
                  disabled={submitting}
                  className="btn w-full py-3 text-base rounded-2xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Reject Client's Request"}
                </button>
              </div>
            </div>
          )}

          {!isNegotiationResponse && (
            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="btn btn-primary px-6 py-3 text-base rounded-2xl"
              >
                {submitting ? "Saving..." : "Create Plan & Send to Client"}
              </button>
              <button
                onClick={() => router.back()}
                disabled={submitting}
                className="btn btn-secondary px-6 py-3 text-base rounded-2xl"
              >
                Cancel
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

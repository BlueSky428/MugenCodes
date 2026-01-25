"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";
import { validateProjectName, validateRequirements, validateCost, validateDeadline } from "@/lib/validation";

export default function NewProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    requirements: "",
    developmentCost: "",
    deadline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedProjectId, setSubmittedProjectId] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <Section eyebrow="Projects" title="Submit a new project">
        <div className="card card-dark p-8">
          <p className="muted">Checking session…</p>
        </div>
      </Section>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    // Validate all fields
    const validationErrors: Record<string, string> = {};
    const nameError = validateProjectName(formData.name);
    if (nameError) validationErrors.name = nameError;
    
    const requirementsError = validateRequirements(formData.requirements);
    if (requirementsError) validationErrors.requirements = requirementsError;
    
    const costError = validateCost(formData.developmentCost);
    if (costError) validationErrors.developmentCost = costError;
    
    const deadlineError = validateDeadline(formData.deadline);
    if (deadlineError) validationErrors.deadline = deadlineError;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          requirements: formData.requirements.trim(),
          developmentCost: parseFloat(formData.developmentCost),
          deadline: formData.deadline,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Failed to create project";
        const details = data.details ? ` ${data.details}` : "";
        setError(errorMsg + details);
        console.error("Project creation error:", data);
        return;
      }

      // Show success modal and store project ID for redirect
      setSubmittedProjectId(data.project.id);
      setShowSuccessModal(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Project creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    if (submittedProjectId) {
      router.push(`/projects/${submittedProjectId}`);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && session?.user?.email && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-fade-in-up border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-ink dark:text-white mb-3">
                Project Submitted Successfully
              </h3>
              <p className="text-center text-ink/70 dark:text-white/70 mb-6 leading-relaxed">
                Thank you for submitting your project! We&apos;ve received your request and will carefully evaluate its development potential. We&apos;ll notify you at <span className="font-medium text-ink dark:text-white">{session.user.email}</span> as soon as we have an update.
              </p>
              <button
                onClick={handleModalOk}
                className="btn btn-primary w-full py-3 text-base rounded-xl"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Section eyebrow="Projects" title="Submit a new project">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="card card-dark p-8 space-y-6"
          >
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium text-ink dark:text-white">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="project-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`input ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="project-requirements" className="text-sm font-medium text-ink dark:text-white">
                Project Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="project-requirements"
                value={formData.requirements}
                onChange={(e) => {
                  setFormData({ ...formData, requirements: e.target.value });
                  if (errors.requirements) setErrors({ ...errors, requirements: "" });
                }}
                required
                rows={8}
                aria-invalid={!!errors.requirements}
                aria-describedby={errors.requirements ? "requirements-error" : undefined}
                className={`textarea ${errors.requirements ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Describe your project requirements in detail..."
              />
              {errors.requirements && (
                <p id="requirements-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.requirements}
                </p>
              )}
              <p className="text-xs text-ink/60 dark:text-white/60">
                {formData.requirements.length}/5000 characters (minimum 20)
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="development-cost" className="text-sm font-medium text-ink dark:text-white">
                  Development Cost ($) <span className="text-red-500">*</span>
                </label>
                <input
                  id="development-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.developmentCost}
                  onChange={(e) => {
                    setFormData({ ...formData, developmentCost: e.target.value });
                    if (errors.developmentCost) setErrors({ ...errors, developmentCost: "" });
                  }}
                  required
                  aria-invalid={!!errors.developmentCost}
                  aria-describedby={errors.developmentCost ? "cost-error" : undefined}
                  className={`input ${errors.developmentCost ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.developmentCost && (
                  <p id="cost-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.developmentCost}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="development-deadline" className="text-sm font-medium text-ink dark:text-white">
                  Development Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  id="development-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => {
                    setFormData({ ...formData, deadline: e.target.value });
                    if (errors.deadline) setErrors({ ...errors, deadline: "" });
                  }}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  aria-invalid={!!errors.deadline}
                  aria-describedby={errors.deadline ? "deadline-error" : undefined}
                  className={`input ${errors.deadline ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.deadline && (
                  <p id="deadline-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.deadline}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base rounded-2xl"
            >
              {loading ? "Submitting..." : "Submit Project Request"}
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}

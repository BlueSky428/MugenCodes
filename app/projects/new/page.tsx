"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";

export default function NewProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    requirements: "",
    developmentCost: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          requirements: formData.requirements,
          developmentCost: parseFloat(formData.developmentCost),
          deadline: formData.deadline,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show more detailed error message
        const errorMsg = data.error || "Failed to create project";
        const details = data.details ? `\n\nDetails: ${data.details}` : "";
        setError(errorMsg + details);
        console.error("Project creation error:", data);
        return;
      }

      router.push(`/projects/${data.project.id}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <label className="text-sm font-medium text-ink dark:text-white">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink dark:text-white">
                Project Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
                rows={8}
                className="textarea"
                placeholder="Describe your project requirements in detail..."
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink dark:text-white">
                  Development Cost ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.developmentCost}
                  onChange={(e) => setFormData({ ...formData, developmentCost: e.target.value })}
                  required
                  className="input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink dark:text-white">
                  Development Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="input"
                />
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

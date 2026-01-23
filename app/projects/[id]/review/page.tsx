"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Section } from "@/components/Section";

export default function ReviewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${params.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      router.push(`/projects/${params.id}`);
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <Section eyebrow="Projects" title="Review project">
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

  return (
    <>
      <Section eyebrow="Projects" title={`Review project: ${project.name}`}>
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
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-ink/20 dark:text-white/20"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm muted">{rating} out of 5</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink dark:text-white">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="textarea"
                placeholder="Share your experience with this project..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary px-6 py-3 text-base rounded-2xl"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary px-6 py-3 text-base rounded-2xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}

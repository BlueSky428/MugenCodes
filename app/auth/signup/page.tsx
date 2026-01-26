"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Section } from "@/components/Section";
import { validatePassword } from "@/lib/validation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    // Validate all fields
    const validationErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      validationErrors.name = "Name must be at least 2 characters";
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) validationErrors.password = passwordError;
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId.trim(),
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred");
        return;
      }

      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Section eyebrow="Account" title="Create account">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-center">
            <p className="muted">
              Create an account to submit projects and track progress end-to-end.
            </p>
          </div>
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
              <label htmlFor="signup-name" className="text-sm font-medium text-ink dark:text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-name"
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
              <label htmlFor="signup-user-id" className="text-sm font-medium text-ink dark:text-white">
                User ID <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-user-id"
                type="text"
                value={formData.userId}
                onChange={(e) => {
                  setFormData({ ...formData, userId: e.target.value });
                  if (errors.userId) setErrors({ ...errors, userId: "" });
                }}
                required
                aria-invalid={!!errors.userId}
                aria-describedby={errors.userId ? "user-id-error" : undefined}
                className={`input ${errors.userId ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Choose a unique User ID"
              />
              {errors.userId && (
                <p id="user-id-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.userId}
                </p>
              )}
              <p className="text-xs text-ink/60 dark:text-white/60">
                This will be your login identifier. Use letters, numbers, underscores, or hyphens.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-ink dark:text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`input ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm-password" className="text-sm font-medium text-ink dark:text-white">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                }}
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                className={`input ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-base rounded-2xl"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-ink/70 dark:text-white/70">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-black hover:underline dark:text-white">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}

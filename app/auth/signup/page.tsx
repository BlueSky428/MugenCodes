"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Section } from "@/components/Section";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
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
              <label className="text-sm font-medium text-ink dark:text-white">
                Name
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink dark:text-white">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink dark:text-white">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="input"
              />
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

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Section } from "@/components/Section";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setError("");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First, check if email exists
      const emailCheckResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const emailCheck = await emailCheckResponse.json();

      if (!emailCheck.exists) {
        setError("Invalid email address. Please check your email and try again.");
        setLoading(false);
        return;
      }

      // If email exists, try to sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid password. Please check your password and try again.");
      } else {
        router.push("/projects/new");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section eyebrow="Account" title="Sign in">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="muted">
            Welcome back. Use your email and password to access your projects.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="card card-dark p-8 space-y-6"
        >
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-base rounded-2xl"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-ink/70 dark:text-white/70">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-black hover:underline dark:text-white">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Section>
  );
}


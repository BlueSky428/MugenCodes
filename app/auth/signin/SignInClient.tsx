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
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setError("");
      if (searchParams.get("verify") === "true") {
        const emailParam = searchParams.get("email");
        if (emailParam) {
          setEmail(decodeURIComponent(emailParam));
          setVerificationMessage("Account created! Please check your email to verify your account before signing in.");
          setShowResendVerification(true);
        }
      }
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
        router.push("/projects");
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
          {verificationMessage && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Email Verification Required</p>
                  <p>{verificationMessage}</p>
                  {showResendVerification && (
                    <button
                      type="button"
                      onClick={async () => {
                        setResending(true);
                        try {
                          const response = await fetch("/api/auth/resend-verification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                          });
                          const data = await response.json();
                          if (response.ok) {
                            setVerificationMessage("Verification email sent! Please check your inbox.");
                          } else {
                            setError(data.error || "Failed to resend verification email");
                          }
                        } catch (err) {
                          setError("An error occurred. Please try again.");
                        } finally {
                          setResending(false);
                        }
                      }}
                      disabled={resending || !email}
                      className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline disabled:opacity-50"
                    >
                      {resending ? "Sending..." : "Resend verification email"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
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


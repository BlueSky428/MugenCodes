"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/Section";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already-verified">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          if (data.alreadyVerified) {
            setStatus("already-verified");
            setMessage("Your email is already verified.");
          } else {
            setStatus("success");
            setMessage("Your email has been verified successfully!");
          }
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while verifying your email");
      }
    };

    verifyEmail();
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setMessage(data.error || "Failed to resend verification email");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Section eyebrow="Email Verification" title="Verify Your Email">
      <div className="max-w-md mx-auto">
        <div className="card card-dark p-8 space-y-6">
          {status === "loading" && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="animate-spin w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="muted">Verifying your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink dark:text-white mb-2">
                Email Verified Successfully!
              </h3>
              <p className="muted mb-6">{message}</p>
              <Link
                href="/auth/signin"
                className="btn btn-primary w-full py-3 text-base rounded-2xl"
              >
                Sign In
              </Link>
            </div>
          )}

          {status === "already-verified" && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink dark:text-white mb-2">
                Already Verified
              </h3>
              <p className="muted mb-6">{message}</p>
              <Link
                href="/auth/signin"
                className="btn btn-primary w-full py-3 text-base rounded-2xl"
              >
                Sign In
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink dark:text-white mb-2">
                Verification Failed
              </h3>
              <p className="muted mb-6">{message}</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="resend-email" className="block text-sm font-medium text-ink dark:text-white mb-2">
                    Resend Verification Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="resend-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input flex-1"
                    />
                    <button
                      onClick={handleResend}
                      className="btn btn-primary px-6 py-3 rounded-2xl"
                    >
                      Resend
                    </button>
                  </div>
                </div>
                
                <Link
                  href="/auth/signin"
                  className="block btn btn-secondary w-full py-3 text-base rounded-2xl"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

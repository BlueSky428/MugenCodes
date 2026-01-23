"use client";

import { useState } from "react";

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const initialState: FormState = { status: "idle" };

export const ContactForm = () => {
  const [state, setState] = useState<FormState>(initialState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "loading" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        company: payload.company,
        summary: payload.summary,
        budget: payload.budget,
        timeline: payload.timeline,
        privacyAccepted: payload.privacy === "on",
        website: payload.website
      })
    });

    if (response.ok) {
      form.reset();
      setState({
        status: "success",
        message:
          "Thank you for your inquiry. We will respond within two business days with next steps."
      });
      return;
    }

    const data = (await response.json()) as {
      errors?: Record<string, string>;
    };

    setState({
      status: "error",
      message: "Please review the form for errors and try again.",
      fieldErrors: data.errors
    });
  };

  return (
    <form
      className="space-y-6 rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white animate-fade-in">
          Name
          <input
            name="name"
            required
            className="input"
          />
          {state.fieldErrors?.name ? (
            <p className="text-xs text-red-600 dark:text-red-400 animate-fade-in mt-1">{state.fieldErrors.name}</p>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Email
          <input
            name="email"
            type="email"
            required
            className="input"
          />
          {state.fieldErrors?.email ? (
            <p className="text-xs text-red-600 dark:text-red-400 animate-fade-in mt-1">{state.fieldErrors.email}</p>
          ) : null}
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-ink dark:text-white animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Company (optional)
        <input
          name="company"
          className="input"
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-ink dark:text-white animate-fade-in" style={{ animationDelay: "0.3s" }}>
        Project summary
        <textarea
          name="summary"
          required
          rows={5}
          className="textarea"
        />
        {state.fieldErrors?.summary ? (
          <p className="text-xs text-red-600 dark:text-red-400 animate-fade-in mt-1">{state.fieldErrors.summary}</p>
        ) : null}
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white animate-fade-in" style={{ animationDelay: "0.4s" }}>
          Budget range (optional)
          <input
            name="budget"
            className="input"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white animate-fade-in" style={{ animationDelay: "0.5s" }}>
          Timeline (optional)
          <input
            name="timeline"
            className="input"
          />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm text-ink dark:text-white animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <input
          type="checkbox"
          name="privacy"
          required
          className="mt-1 h-4 w-4 rounded border-2 border-gray-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 dark:border-gray-600 dark:bg-gray-800"
        />
        I agree to the privacy policy and terms of service.
      </label>
      {state.fieldErrors?.privacyAccepted ? (
        <p className="text-xs text-red-600 dark:text-red-400 animate-fade-in">
          {state.fieldErrors.privacyAccepted}
        </p>
      ) : null}
      <label className="hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        type="submit"
        className="btn btn-primary w-full md:w-auto animate-fade-in"
        style={{ animationDelay: "0.7s" }}
        disabled={state.status === "loading"}
      >
        {state.status === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Submit request
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
      {state.message ? (
        <div
          className={`rounded-xl p-4 text-sm animate-fade-in ${
            state.status === "success" 
              ? "bg-green-50 border-2 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" 
              : "bg-red-50 border-2 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {state.status === "success" ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {state.message}
          </div>
        </div>
      ) : null}
    </form>
  );
};

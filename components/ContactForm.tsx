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
      className="space-y-6 rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white">
          Name
          <input
            name="name"
            required
            className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft"
          />
          {state.fieldErrors?.name ? (
            <p className="text-xs text-accent">{state.fieldErrors.name}</p>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white">
          Email
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft"
          />
          {state.fieldErrors?.email ? (
            <p className="text-xs text-accent">{state.fieldErrors.email}</p>
          ) : null}
        </label>
      </div>
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white">
          Company (optional)
        <input
          name="company"
          className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft"
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-ink dark:text-white">
        Project summary
        <textarea
          name="summary"
          required
          rows={5}
          className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft"
        />
        {state.fieldErrors?.summary ? (
          <p className="text-xs text-accent">{state.fieldErrors.summary}</p>
        ) : null}
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white">
          Budget range (optional)
          <input
            name="budget"
            className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-ink dark:text-white">
          Timeline (optional)
          <input
            name="timeline"
            className="w-full rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-night dark:text-white dark:focus-visible:ring-offset-nightSoft"
          />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm text-ink dark:text-white">
        <input
          type="checkbox"
          name="privacy"
          required
          className="mt-1 h-4 w-4 rounded border-ink/20 dark:border-white/20"
        />
        I agree to the privacy policy and terms of service.
      </label>
      {state.fieldErrors?.privacyAccepted ? (
        <p className="text-xs text-accent">
          {state.fieldErrors.privacyAccepted}
        </p>
      ) : null}
      <label className="hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-nightSoft"
        disabled={state.status === "loading"}
      >
        {state.status === "loading" ? "Submitting" : "Submit request"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-accent" : "text-ink/70"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
};

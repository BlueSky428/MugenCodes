import type { Metadata } from "next";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Services"
};

const services = [
  {
    title: "Web applications",
    body:
      "We build calm and dependable web apps for teams that need clear workflows. A typical engagement starts with a prototype, then moves into a full build. The result is a web app that is easy to use and easy to maintain."
  },
  {
    title: "Backend and APIs",
    body:
      "We design and build the systems that power your product. We define what data is needed and how it moves, then build reliable services. The result is a backend that stays stable under growth."
  },
  {
    title: "Blockchain systems",
    body:
      "We create secure blockchain features when they add real value. We start with a small proof, then build the full system if it is a fit. The result is a trusted ledger and clear on chain flows."
  },
  {
    title: "AI and automation",
    body:
      "We use AI to reduce manual work, such as sorting data or drafting content. We test it with real examples and set clear limits. The result is faster operations with human control."
  }
];

export default function ServicesPage() {
  return (
    <>
      <Section title="Services built for calm delivery">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accentSoft dark:bg-accent/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    d="M4 12h16M12 4v16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-ink dark:text-white">
                {service.title}
              </h3>
              <p className="mt-4 text-ink/70 dark:text-white/70">{service.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What we do not do">
        <p>
          We do not take projects that lack a clear owner on your side. Clear
          decision making is essential for safe delivery.
        </p>
        <p>
          We do not accept rushed timelines that risk quality. We would rather
          say no than leave you with a fragile system.
        </p>
        <p>
          We do not provide staffing for long term onsite roles. We are a
          delivery team that stays responsible for outcomes.
        </p>
      </Section>
    </>
  );
}

import type { Metadata } from "next";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "How We Work"
};

const steps = [
  {
    title: "Discovery with calm listening",
    body:
      "We begin with a careful call to learn your goals and risks. We ask simple questions and write notes you can review."
  },
  {
    title: "Requirements confirmed in writing",
    body:
      "We turn your goals into a short written scope. This becomes the shared agreement so everyone stays aligned."
  },
  {
    title: "Technical planning for stability",
    body:
      "The lead developer plans the system structure, which means how the parts fit together. This plan keeps delivery safe and predictable."
  },
  {
    title: "Development with weekly updates",
    body:
      "The team builds in small steps and shares weekly updates. You always know what is done and what is next."
  },
  {
    title: "Review and quality checks",
    body:
      "We test each feature and review the full system before delivery. This keeps launch calm and lowers the chance of last minute issues."
  },
  {
    title: "Delivery and handover",
    body:
      "We deliver with clear documentation and a handover call. You see how everything works before we finish."
  },
  {
    title: "Post launch support",
    body:
      "We stay close after launch for fixes and improvements. You are not left alone with a new system."
  }
];

export default function HowWeWorkPage() {
  return (
    <Section title="How we work">
      <div className="space-y-8">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft"
          >
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              {step.title}
            </h3>
            <p className="mt-4 text-ink/70 dark:text-white/70">{step.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

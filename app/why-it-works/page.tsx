import type { Metadata } from "next";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Why It Works"
};

export default function WhyItWorksPage() {
  return (
    <>
      <Section title="Why this team design works">
        <p>
          The real pain is not a lack of skill. The real pain is that skilled
          developers often fail to deliver value when communication is weak and
          ownership is unclear.
        </p>
        <p>
          We solve this with clear separation of roles. The project manager owns
          client communication and payment closure. The lead developer owns the
          plan, the quality checks, and final delivery. The senior developers
          own their assigned work.
        </p>
      </Section>

      <Section title="Lower risk through clear ownership">
        <p>
          Every decision has a clear owner. This keeps work moving and prevents
          confusion.
        </p>
        <p>
          When a question appears, it goes to the project manager first. When a
          technical choice is needed, it goes to the lead developer. This keeps
          the team aligned and keeps delivery steady.
        </p>
      </Section>

      <Section title="Accountability and documentation">
        <p>
          We confirm requirements in writing and keep a simple record of
          decisions. This makes progress easy to see and reduces surprises.
        </p>
        <p>
          We document what we deliver so handover is smooth. You know what was
          built and how it works.
        </p>
      </Section>
    </>
  );
}

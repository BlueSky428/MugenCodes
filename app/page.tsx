import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Section } from "@/components/Section";

const faqItems = [
  {
    question: "How do we start a project",
    answer:
      "We begin with a calm call to hear your goals. We then write a clear plan so you can review it in simple words."
  },
  {
    question: "Who do I talk to each week",
    answer:
      "You speak with our project manager. You always get one clear voice and steady updates."
  },
  {
    question: "How do you manage risk",
    answer:
      "We set clear ownership for every step. The lead developer checks the plan and the quality so problems are found early."
  },
  {
    question: "What happens after delivery",
    answer:
      "We stay close for support and improvements. You have a clear handover so your team feels confident."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="bg-surface dark:bg-night">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-accentSoft blur-2xl dark:bg-accent/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accentSoft/70 blur-2xl dark:bg-accent/10"
          />
          <div className="relative max-w-3xl space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl dark:text-white">
              Calm delivery you can trust
            </h1>
            <p className="text-[19px] text-ink/70 dark:text-white/70">
              Senior engineers and clear communication so your project stays safe
              and on time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-night"
              >
                Talk to our Project Manager
              </Link>
              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3 text-base font-semibold text-ink transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:focus-visible:ring-offset-night"
              >
                See how we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="Clear ownership lowers risk">
        <p>
          You work with a focused team of four. The project manager keeps
          requirements clear, progress visible, and payments simple. The lead
          developer plans the system structure, which means how the parts fit
          together, and owns quality and delivery. Two senior developers build
          and test their own work.
        </p>
        <p>
          This structure creates fast communication and steady delivery. You
          know who is responsible for each decision, which keeps the project
          calm.
        </p>
      </Section>

      <Section title="Outcomes that protect your investment">
        <p>
          You get stable architecture, meaning a clear system structure, so the
          product stays easy to change.
        </p>
        <p>
          You get clean delivery with careful review, so launch days feel quiet
          and safe.
        </p>
        <p>
          You get ongoing support with a known team, so the product keeps
          improving without confusion.
        </p>
      </Section>

      <Section>
        <CTA
          title="Talk with the person who owns clarity"
          body="Our project manager listens first, then guides the plan. You get calm answers and a clear path."
          primaryLabel="Talk to our Project Manager"
          primaryHref="/contact"
          secondaryLabel="See how we work"
          secondaryHref="/how-we-work"
        />
      </Section>

      <Section title="Questions we often hear">
        <FAQ items={faqItems} />
      </Section>
    </>
  );
}

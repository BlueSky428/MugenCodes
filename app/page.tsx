import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Section } from "@/components/Section";

const faqItems = [
  {
    question: "How do we start a project?",
    answer:
      "We begin with a consultation call to understand your objectives and requirements. We then prepare a comprehensive written plan for your review and approval."
  },
  {
    question: "Who do I communicate with on a regular basis?",
    answer:
      "You will have direct communication with our project manager, who serves as your primary point of contact and provides consistent updates throughout the project lifecycle."
  },
  {
    question: "How do you manage project risk?",
    answer:
      "We establish clear ownership for every project phase. Our lead developer reviews the technical plan and conducts quality assurance checks to identify and address potential issues early in the development process."
  },
  {
    question: "What happens after project delivery?",
    answer:
      "We provide ongoing support and maintenance services. You receive comprehensive documentation and a detailed handover to ensure your team can confidently manage the delivered system."
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
              Reliable delivery you can trust
            </h1>
            <p className="text-[19px] text-ink/70 dark:text-white/70">
              Senior engineers and transparent communication to ensure your project is delivered safely and on schedule.
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

      <Section title="Clear ownership reduces risk">
        <p>
          You work with a dedicated team of four professionals. The project manager maintains clear requirements, transparent progress tracking, and streamlined payment processes. The lead developer designs the system architecture and oversees quality assurance and delivery. Two senior developers implement and test their assigned components.
        </p>
        <p>
          This organizational structure enables efficient communication and consistent delivery. Decision-making authority is clearly defined, ensuring accountability and project stability.
        </p>
      </Section>

      <Section title="Outcomes that protect your investment">
        <p>
          You receive a stable, well-architected system with a clear structure that remains maintainable and adaptable to future requirements.
        </p>
        <p>
          You receive thoroughly tested deliverables with comprehensive quality reviews, ensuring smooth and confident launches.
        </p>
        <p>
          You receive ongoing support from your dedicated team, enabling continuous product improvement with clear communication and documentation.
        </p>
      </Section>

      <Section>
        <CTA
          title="Speak with the person responsible for project clarity"
          body="Our project manager begins by understanding your needs, then develops a strategic plan. You receive clear guidance and a well-defined path forward."
          primaryLabel="Contact our Project Manager"
          primaryHref="/contact"
          secondaryLabel="Learn how we work"
          secondaryHref="/how-we-work"
        />
      </Section>

      <Section title="Frequently asked questions">
        <FAQ items={faqItems} />
      </Section>
    </>
  );
}

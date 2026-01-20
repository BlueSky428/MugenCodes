import type { Metadata } from "next";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "How We Work"
};

const steps = [
  {
    title: "Discovery and requirements gathering",
    body:
      "We begin with a comprehensive consultation to understand your objectives, requirements, and potential risks. We conduct structured interviews and document findings for your review and approval."
  },
  {
    title: "Requirements documentation and confirmation",
    body:
      "We translate your objectives into a comprehensive written scope document. This document serves as the formal agreement to ensure all stakeholders remain aligned throughout the project."
  },
  {
    title: "Technical architecture and planning",
    body:
      "Our lead developer designs the system architecture, defining how components integrate and interact. This technical plan ensures safe, predictable delivery and maintainable solutions."
  },
  {
    title: "Iterative development with regular updates",
    body:
      "The development team implements features in incremental phases and provides weekly progress reports. You maintain full visibility into completed work and upcoming milestones."
  },
  {
    title: "Quality assurance and system review",
    body:
      "We conduct comprehensive testing for each feature and perform full system reviews prior to delivery. This rigorous process ensures smooth launches and minimizes post-deployment issues."
  },
  {
    title: "Delivery and knowledge transfer",
    body:
      "We deliver the completed system with comprehensive documentation and conduct a detailed handover session. You receive full visibility into system functionality and operational procedures before project completion."
  },
  {
    title: "Post-launch support and maintenance",
    body:
      "We provide ongoing support and maintenance services following launch. You receive continued assistance for bug fixes, enhancements, and system optimization."
  }
];

export default function HowWeWorkPage() {
  return (
    <Section>
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

import type { Metadata } from "next";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Why Choose Us"
};

export default function WhyChooseUsPage() {
  return (
    <>
      <Section>
        <div className="grid gap-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              The challenge and our approach
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              The primary challenge in software development is not a lack of technical expertise, but rather the failure of skilled developers to deliver value when communication is inadequate and ownership is ambiguous. We address this challenge through a structured team approach that combines collaborative development with clear accountability.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Collaborative development advantage
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              With three professional developers working collaboratively on your project, you benefit from significant advantages over hiring a single freelancer. Our team structure enables parallel development, where multiple features are built simultaneously rather than sequentially. This approach reduces project timelines while maintaining high quality standards. Quality is enhanced through peer review and collaborative problem-solving—each developer's work is reviewed by team members, catching issues early and ensuring consistent code quality.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Clear ownership and accountability
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              We provide clear ownership and accountability through defined roles: Project Manager, Lead Developer, and Senior Developers. Every decision has an owner, eliminating ambiguity about responsibility. The project manager is responsible for client communication and project closure, serving as your single point of contact for transparent communication. You receive regular updates and written documentation, ensuring clear progress visibility throughout the project lifecycle.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Senior expertise
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              Our team brings senior expertise with an experienced team (ages 31–41) and specialized skills in architecture, quality assurance, documentation, and problem-solving. Our international experience spans India and Japan, bringing diverse perspectives to your project. The lead developer is responsible for technical planning, quality assurance, and final delivery, while senior developers take full ownership of their assigned deliverables.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Risk mitigation
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              We implement comprehensive risk mitigation through quality assurance at every stage, early issue detection, and structured planning and review processes. Our lead developer conducts independent code reviews and quality checks before delivery, ensuring that potential problems are identified and addressed early in the development process.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Reliable delivery
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              You can expect reliable delivery with on-time completion, thoroughly tested systems, and comprehensive documentation. We confirm all requirements in writing and maintain detailed records of project decisions, providing clear visibility into progress and minimizing unexpected issues. Comprehensive documentation for all deliverables ensures smooth knowledge transfer, so you receive complete information about what was built and how it operates.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Ongoing support
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              We provide ongoing support with post-launch maintenance, knowledge transfer, and a continued relationship. This collaborative environment means knowledge is shared across the team, reducing dependency on any single person and ensuring continuity. Additionally, our developers specialize in their areas of expertise while supporting each other. The lead developer focuses on architecture and planning, while senior developers handle implementation, with each contributing their strengths to deliver superior results in less time. When complex challenges arise, the team pools expertise to find solutions faster than an individual working alone.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4">
              Investment protection
            </h2>
            <p className="text-ink/70 dark:text-white/70">
              Your investment is protected through maintainable architecture, scalable systems, and future-proof solutions. We design systems with a clear structure that remains maintainable and adaptable to future requirements, ensuring your product can grow with your business without requiring expensive refactoring.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

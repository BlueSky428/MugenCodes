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
          </div>
        </div>
      </section>

      <Section title="Why choose us">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              The challenge and our approach
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              The primary challenge in software development is not a lack of technical expertise, but rather the failure of skilled developers to deliver value when communication is inadequate and ownership is ambiguous. We address this challenge through a structured team approach that combines collaborative development with clear accountability.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Collaborative development advantage
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              With three professional developers working collaboratively on your project, you benefit from significant advantages over hiring a single freelancer. Our team structure enables parallel development, where multiple features are built simultaneously rather than sequentially. This approach reduces project timelines while maintaining high quality standards. Quality is enhanced through peer review and collaborative problem-solving—each developer's work is reviewed by team members, catching issues early and ensuring consistent code quality.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Clear ownership and accountability
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We provide clear ownership and accountability through defined roles: Project Manager, Lead Developer, and Senior Developers. Every decision has an owner, eliminating ambiguity about responsibility. The project manager is responsible for client communication and project closure, serving as your single point of contact for transparent communication. You receive regular updates and written documentation, ensuring clear progress visibility throughout the project lifecycle.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Senior expertise
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              Our team brings senior expertise with an experienced team (ages 31–41) and specialized skills in architecture, quality assurance, documentation, and problem-solving. Our international experience spans India and Japan, bringing diverse perspectives to your project. The lead developer is responsible for technical planning, quality assurance, and final delivery, while senior developers take full ownership of their assigned deliverables.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Risk mitigation
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We implement comprehensive risk mitigation through quality assurance at every stage, early issue detection, and structured planning and review processes. Our lead developer conducts independent code reviews and quality checks before delivery, ensuring that potential problems are identified and addressed early in the development process.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Reliable delivery
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              You can expect reliable delivery with on-time completion, thoroughly tested systems, and comprehensive documentation. We confirm all requirements in writing and maintain detailed records of project decisions, providing clear visibility into progress and minimizing unexpected issues. Comprehensive documentation for all deliverables ensures smooth knowledge transfer, so you receive complete information about what was built and how it operates.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Ongoing support
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We provide ongoing support with post-launch maintenance, knowledge transfer, and a continued relationship. This collaborative environment means knowledge is shared across the team, reducing dependency on any single person and ensuring continuity. Additionally, our developers specialize in their areas of expertise while supporting each other. The lead developer focuses on architecture and planning, while senior developers handle implementation, with each contributing their strengths to deliver superior results in less time. When complex challenges arise, the team pools expertise to find solutions faster than an individual working alone.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <h2 className="text-2xl font-semibold text-ink dark:text-white mb-4 md:mb-5">
              Investment protection
            </h2>
            <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
              Your investment is protected through maintainable architecture, scalable systems, and future-proof solutions. We design systems with a clear structure that remains maintainable and adaptable to future requirements, ensuring your product can grow with your business without requiring expensive refactoring.
            </p>
          </div>
        </div>
      </Section>

      <Section title="How we work">
        <div className="space-y-8">
          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Discovery and requirements gathering
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We begin with a comprehensive consultation to understand your objectives, requirements, and potential risks. We conduct structured interviews and document findings for your review and approval.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Requirements documentation and confirmation
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We translate your objectives into a comprehensive written scope document. This document serves as the formal agreement to ensure all stakeholders remain aligned throughout the project.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Technical architecture and planning
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              Our lead developer designs the system architecture, defining how components integrate and interact. This technical plan ensures safe, predictable delivery and maintainable solutions.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Iterative development with regular updates
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              The development team implements features in incremental phases and provides weekly progress reports. You maintain full visibility into completed work and upcoming milestones.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Quality assurance and system review
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We conduct comprehensive testing for each feature and perform full system reviews prior to delivery. This rigorous process ensures smooth launches and minimizes post-deployment issues.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Delivery and knowledge transfer
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We deliver the completed system with comprehensive documentation and conduct a detailed handover session. You receive full visibility into system functionality and operational procedures before project completion.
            </p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft transition hover:shadow-card dark:border-white/10 dark:bg-nightSoft">
            <h3 className="text-2xl font-semibold text-ink dark:text-white">
              Post-launch support and maintenance
            </h3>
            <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
              We provide ongoing support and maintenance services following launch. You receive continued assistance for bug fixes, enhancements, and system optimization.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <FAQ items={faqItems} />
      </Section>
    </>
  );
}

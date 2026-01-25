import { FAQ } from "@/components/FAQ";
import { Section } from "@/components/Section";
import Link from "next/link";

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
      <section className="bg-hero relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08] bg-grid" />
        <div className="container-page relative py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary-200 bg-gray-50/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm animate-fade-in-down dark:border-primary-800 dark:bg-gray-800/80 dark:text-white">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              Calm delivery for important software
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-black md:text-6xl lg:text-7xl dark:text-white animate-fade-in-up">
              Reliable delivery you can{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">
                trust
              </span>
            </h1>
            <p className="mt-6 text-lg muted md:text-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Senior engineers and transparent communication so your project ships safely, predictably, and with clean handover documentation.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/projects/new" className="btn btn-primary px-8 py-4 text-base rounded-2xl shadow-lg">
                Start a project
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/contact" className="btn btn-secondary px-8 py-4 text-base rounded-2xl">
                Talk to us
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="card card-dark card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-ink dark:text-white mb-2">Clear ownership</div>
                <div className="text-sm muted">A single point of contact and documented decisions.</div>
              </div>
              <div className="card card-dark card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-ink dark:text-white mb-2">Predictable delivery</div>
                <div className="text-sm muted">Planning, review, QA, and calm progress updates.</div>
              </div>
              <div className="card card-dark card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-ink dark:text-white mb-2">Senior execution</div>
                <div className="text-sm muted">Architecture-first implementation with handover ready.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Why choose us">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card card-dark card-hover p-8 animate-fade-in-up group">
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Approach</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              The challenge and our approach
            </h3>
            <p className="muted leading-relaxed">
              The biggest risk in software isn&apos;t skill—it&apos;s unclear communication and ambiguous ownership. We reduce risk with a calm, documented workflow and explicit responsibilities.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Team</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Collaborative development advantage
            </h3>
            <p className="muted leading-relaxed">
              A small senior team means parallel execution and built-in peer review. Faster iteration, fewer surprises, and consistent quality across the entire system.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.2s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Process</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Clear ownership and accountability
            </h3>
            <p className="muted leading-relaxed">
              Defined roles (PM + lead + seniors) keep decisions fast and traceable. You always know what&apos;s done, what&apos;s next, and who owns it.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.3s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Quality</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Senior expertise
            </h3>
            <p className="muted leading-relaxed">
              Architecture, QA, documentation, and safe delivery practices are built into the work—not added at the end.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.4s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Safety</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Risk mitigation
            </h3>
            <p className="muted leading-relaxed">
              Plan first, validate early, review continuously. Problems get caught when they&apos;re cheap to fix.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.5s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Delivery</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Reliable delivery
            </h3>
            <p className="muted leading-relaxed">
              Tested releases, written confirmation of scope, and clean handover so your team can maintain the system confidently.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.6s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Support</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Ongoing support
            </h3>
            <p className="muted leading-relaxed">
              Post-launch maintenance, improvements, and calm operational support when you need it.
            </p>
          </div>

          <div className="card card-dark card-hover p-8 animate-fade-in-up group" style={{ animationDelay: "0.7s" }}>
            <div className="badge mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">Future-proof</div>
            <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Investment protection
            </h3>
            <p className="muted leading-relaxed">
              Maintainable architecture and scalable systems so growth doesn&apos;t force expensive rewrites.
            </p>
          </div>
        </div>
      </Section>

      <Section title="How we work">
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Discovery and requirements gathering
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  We begin with a comprehensive consultation to understand your objectives, requirements, and potential risks. We conduct structured interviews and document findings for your review and approval.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Requirements documentation and confirmation
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  We translate your objectives into a comprehensive written scope document. This document serves as the formal agreement to ensure all stakeholders remain aligned throughout the project.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Technical architecture and planning
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  Our lead developer designs the system architecture, defining how components integrate and interact. This technical plan ensures safe, predictable delivery and maintainable solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Iterative development with regular updates
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  The development team implements features in incremental phases and provides weekly progress reports. You maintain full visibility into completed work and upcoming milestones.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">5</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Quality assurance and system review
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  We conduct comprehensive testing for each feature and perform full system reviews prior to delivery. This rigorous process ensures smooth launches and minimizes post-deployment issues.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">6</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Delivery and knowledge transfer
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  We deliver the completed system with comprehensive documentation and conduct a detailed handover session. You receive full visibility into system functionality and operational procedures before project completion.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink/10 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-nightSoft dark:hover:border-primary-800 animate-fade-in-up group" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">7</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  Post-launch support and maintenance
                </h3>
                <p className="mt-4 text-base text-ink/70 dark:text-white/70 leading-relaxed">
                  We provide ongoing support and maintenance services following launch. You receive continued assistance for bug fixes, enhancements, and system optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <FAQ items={faqItems} />
      </Section>
    </>
  );
}

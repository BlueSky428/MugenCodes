import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Services"
};

type ServiceItem = {
  title: string;
  body: string;
  bullets: string[];
};

type ServiceCategory = {
  id: string;
  title: string;
  intro: string;
  items: ServiceItem[];
};

const serviceCategories: ServiceCategory[] = [
  {
    id: "full-stack",
    title: "Full‑stack",
    intro:
      "We take care of your product from the screen your customers see to the systems that run in the background. You explain what you need, and we turn it into a clear plan and steady delivery you can follow.",
    items: [
      {
        title: "Web applications",
        body:
          "Web apps that feel smooth to use and are simple to understand—for your customers and your internal team.",
        bullets: [
          "Screens that work well on both desktop and mobile",
          "Clear dashboards and admin screens for your team",
          "Simple flows for sign‑up, login, and everyday tasks",
          "A structure that makes future changes easier and safer"
        ]
      },
      {
        title: "Backend services and APIs",
        body:
          "Behind‑the‑scenes systems that keep your product fast, stable, and able to grow without surprises.",
        bullets: [
          "Save and read data in a safe, predictable way",
          "Handle busy periods without the product slowing down",
          "Take care of routine background tasks so people do less manual work",
          "Give you insight into what is happening through simple logs and checks"
        ]
      },
      {
        title: "Integrations and payments",
        body:
          "Connect your product to the other tools you already use, so information moves without copy‑and‑paste work.",
        bullets: [
          "Online payments and subscriptions that are easy to understand",
          "Email and notifications that reach the right people at the right time",
          "Connections to CRMs, ERPs, or other business tools you already depend on",
          "Safe, clear ways to share information with partners when needed"
        ]
      }
    ]
  },
  {
    id: "blockchain",
    title: "Blockchain",
    intro:
      "We add blockchain only when it clearly helps your business—for example, when you need records that everyone can trust, or when many parties must share the same view of data. We keep the setup and ongoing operation as simple and calm as possible for you.",
    items: [
      {
        title: "Smart contracts and token flows",
        body:
          "Digital agreements that run on their own once rules are set, reducing manual checks and disputes.",
        bullets: [
          "Work with you to write down the rules in plain language first",
          "Turn those rules into reliable on‑chain behavior",
          "Design how people move through buying, selling, or accessing features",
          "Explain how updates and changes will work over time"
        ]
      },
      {
        title: "On‑chain and off‑chain systems",
        body:
          "Products that combine blockchain with a normal web experience, so users do not have to think about the underlying technology.",
        bullets: [
          "Web and mobile screens that feel familiar to users",
          "Simple views of activity and balances for your team",
          "Clear records so you can answer questions from auditors or partners",
          "Straightforward ways to monitor the system and know when action is needed"
        ]
      }
    ]
  },
  {
    id: "ai",
    title: "AI",
    intro:
      "We use AI to take over the busy‑work so your team can focus on decisions and relationships. We keep a human in control and make sure the system behaves in ways you can see and understand.",
    items: [
      {
        title: "AI features inside your product",
        body:
          "Features inside your product that help people read less, decide faster, and find what they need more easily.",
        bullets: [
          "Summaries of long texts so people can grasp the point quickly",
          "Pull out key details from documents or conversations",
          "Better search and organization for large collections of content",
          "Assistant tools that suggest actions but still let humans confirm"
        ]
      },
      {
        title: "Automation and operational tooling",
        body:
          "Automation that quietly handles repetitive tasks and flags only the items that need a person’s attention.",
        bullets: [
          "Move information between systems without manual copying",
          "Clean up and enrich data so reports and dashboards stay useful",
          "Regular checks so you know when AI results start to drift or change",
          "Clear fallbacks when something goes wrong, so work does not stop"
        ]
      }
    ]
  }
];

// Service category icons
const ServiceIcon = ({ categoryId }: { categoryId: string }) => {
  const icons: Record<string, ReactNode> = {
    "full-stack": (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    blockchain: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    ai: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  };
  return <div className="text-primary-600 dark:text-primary-400">{icons[categoryId] || icons["full-stack"]}</div>;
};

// Service item icons
const ServiceItemIcon = ({ title }: { title: string }) => {
  const iconMap: Record<string, ReactNode> = {
    "Web applications": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    "Backend services and APIs": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    "Integrations and payments": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    "Smart contracts and token flows": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    "On‑chain and off‑chain systems": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    "AI features inside your product": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    "Automation and operational tooling": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  };
  return <div className="text-primary-500 dark:text-primary-400">{iconMap[title] || null}</div>;
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-hero relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12] bg-grid" />
        <div className="container-page relative py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm dark:border-primary-800 dark:bg-gray-900/80 dark:text-white">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              Our Services
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl dark:text-white mb-6">
              What we build
            </h1>
            <p className="text-lg md:text-xl muted max-w-2xl mx-auto">
              Clean implementation, calm communication, and documented decisions. We deliver full-stack products, blockchain solutions, and AI-powered features.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Services Overview */}
      <Section eyebrow="Overview" title="Our Core Services">
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {serviceCategories.map((category, index) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="card card-dark card-hover p-6 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ServiceIcon categoryId={category.id} />
              </div>
              <h3 className="text-xl font-semibold text-ink dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {category.title}
              </h3>
              <p className="text-sm muted line-clamp-3">{category.intro}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
                Learn more
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* Detailed Services */}
      <Section eyebrow="Services" title="Detailed Service Offerings">
        <div className="mt-10 space-y-12">
          {serviceCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              id={category.id}
              className="card card-dark card-hover scroll-mt-24 p-8 md:p-10 animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 0.15}s` }}
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <ServiceIcon categoryId={category.id} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="badge w-fit bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                      {category.title}
                    </div>
                    <Link
                      href={`/portfolio?category=${category.id === "full-stack" ? "Full-stack" : category.id === "blockchain" ? "Blockchain" : category.id === "ai" ? "AI" : category.title}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300 group/link"
                    >
                      View {category.title} Projects
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <h3 className="text-3xl font-bold text-ink dark:text-white mb-3">{category.title}</h3>
                  <p className="text-lg muted max-w-3xl">{category.intro}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border-2 border-ink/10 bg-white p-6 transition-all duration-300 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-1 dark:border-white/10 dark:bg-gray-900 dark:hover:border-primary-800 animate-fade-in-up group"
                    style={{ animationDelay: `${(categoryIndex * 0.15) + (itemIndex * 0.1)}s` }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <ServiceItemIcon title={item.title} />
                      </div>
                      <h4 className="text-lg font-semibold text-ink dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {item.title}
                      </h4>
                    </div>
                    <p className="mt-2 text-sm muted mb-4">{item.body}</p>
                    <ul className="space-y-2.5 text-sm muted">
                      {item.bullets.map((bullet, bulletIndex) => (
                        <li key={bullet} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${(categoryIndex * 0.15) + (itemIndex * 0.1) + (bulletIndex * 0.05)}s` }}>
                          <svg className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Scope" title="Services we do not provide">
        <div className="card card-dark p-8 md:p-10 max-w-3xl animate-fade-in-up">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-ink dark:text-white mb-4">What we don&apos;t do</h3>
              <div className="space-y-4 text-base muted">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                  <p>
                    We do not accept projects without a clearly defined project owner on the client side. Effective decision-making authority is essential for successful project delivery.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                  <p>
                    We do not accept unrealistic timelines that compromise quality standards. We prefer to decline projects rather than deliver systems that lack robustness and maintainability.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                  <p>
                    We do not provide long-term staffing or onsite placement services. We operate as a dedicated delivery team that maintains accountability for project outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

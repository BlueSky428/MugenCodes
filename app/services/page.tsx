import type { Metadata } from "next";

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
    title: "Full‑stack product development",
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

export default function ServicesPage() {
  return (
    <>
      <Section>
        <div className="space-y-10">
          {serviceCategories.map((category) => (
            <div
              key={category.title}
              id={category.id}
              className="space-y-6 rounded-3xl border border-ink/10 bg-white p-8 shadow-card dark:border-white/10 dark:bg-nightSoft scroll-mt-24"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-ink dark:text-white">
                  {category.title}
                </h3>
                <p className="max-w-3xl text-ink/70 dark:text-white/70">
                  {category.intro}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-ink/10 bg-surface/80 p-5 text-sm dark:border-white/15 dark:bg-night"
                  >
                    <h4 className="text-base font-semibold text-ink dark:text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-ink/70 dark:text-white/70">
                      {item.body}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-ink/70 dark:text-white/70">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent/80" />
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

      <Section title="Services we do not provide">
        <p>
          We do not accept projects without a clearly defined project owner on the client side. Effective decision-making authority is essential for successful project delivery.
        </p>
        <p>
          We do not accept unrealistic timelines that compromise quality standards. We prefer to decline projects rather than deliver systems that lack robustness and maintainability.
        </p>
        <p>
          We do not provide long-term staffing or onsite placement services. We operate as a dedicated delivery team that maintains accountability for project outcomes.
        </p>
      </Section>
    </>
  );
}

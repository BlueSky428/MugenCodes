import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <>
      <Section title="Let us talk about your project">
        <p>
          We reply within two business days. The first call is calm and focused
          on your goals and risks.
        </p>
      </Section>

      <section className="pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />
          <div className="space-y-6 rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Direct email
              </h3>
              <p className="text-ink/70 dark:text-white/70">
                You can also email us at{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Calendar link
              </h3>
              <p className="text-ink/70 dark:text-white/70">
                Book a short introduction call at{" "}
                <a href={siteConfig.calendarUrl}>our calendar link</a>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                What happens next
              </h3>
              <p className="text-ink/70 dark:text-white/70">
                The project manager reviews your request and replies with clear
                questions or a proposed plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

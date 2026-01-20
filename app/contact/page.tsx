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
      <Section title="Let's discuss your project">
        <p>
          We respond to all inquiries within two business days. The initial consultation is structured and focused on understanding your objectives and identifying potential risks.
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
                You may also contact us directly via email at{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Schedule a consultation
              </h3>
              <p className="text-ink/70 dark:text-white/70">
                Schedule an introductory consultation using{" "}
                <a href={siteConfig.calendarUrl}>our calendar booking system</a>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Next steps
              </h3>
              <p className="text-ink/70 dark:text-white/70">
                Our project manager will review your inquiry and respond with specific questions or a proposed project plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

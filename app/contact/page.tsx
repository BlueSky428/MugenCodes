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
        <div className="max-w-3xl">
          <p>
            We respond to all inquiries within two business days. The initial consultation is structured and focused on understanding your objectives and identifying potential risks.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />
          <div className="space-y-6 rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Direct email
              </h3>
              <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
                You may also contact us directly via email at{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Schedule a consultation
              </h3>
              <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
                Schedule an introductory consultation using{" "}
                <a href={siteConfig.calendarUrl}>our calendar booking system</a>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-ink dark:text-white">
                Next steps
              </h3>
              <p className="text-base text-ink/70 dark:text-white/70 leading-relaxed">
                Our project manager will review your inquiry and respond with specific questions or a proposed project plan.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

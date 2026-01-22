import type { Metadata } from "next";

import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact"
};

interface ContactItemProps {
  label: string;
  value: string;
  href: string;
  icon?: string;
}

const ContactItem = ({ label, value, href, icon }: ContactItemProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-6 transition hover:border-accent hover:shadow-soft dark:border-white/10 dark:bg-nightSoft dark:hover:border-accent"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl font-semibold text-accent transition group-hover:bg-accent group-hover:text-white dark:bg-accent/20">
        {icon || label.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-ink/70 dark:text-white/70">
          {label}
        </div>
        <div className="mt-1 text-lg font-semibold text-ink dark:text-white">
          {value}
        </div>
      </div>
    </a>
  );
};

export default function ContactPage() {
  return (
    <>
      <Section title="Get in touch">
        <div className="max-w-3xl">
          <p className="text-base text-ink/70 dark:text-white/70">
            We respond to all inquiries within two business days. Choose your preferred method to reach out to us.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ContactItem
            label="Phone"
            value={siteConfig.phone}
            href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
            icon="📞"
          />
          <ContactItem
            label="Email"
            value={siteConfig.email}
            href={`mailto:${siteConfig.email}`}
            icon="✉️"
          />
          <ContactItem
            label="Telegram"
            value="Jayabrata Bhaduri"
            href={siteConfig.telegram}
            icon="💬"
          />
          <ContactItem
            label="WhatsApp"
            value="Jayabrata Bhaduri"
            href={siteConfig.whatsapp}
            icon="💬"
          />
          <ContactItem
            label="LinkedIn"
            value="Jayabrata Bhaduri"
            href={siteConfig.linkedin}
            icon="💼"
          />
        </div>
      </Section>
    </>
  );
}

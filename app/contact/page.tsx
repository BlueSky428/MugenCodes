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
      className="card card-dark card-hover group flex items-center gap-4 p-6 hover:border-gray-400 dark:hover:border-gray-600"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl font-semibold text-black transition group-hover:bg-black group-hover:text-white dark:bg-gray-800 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black">
        {icon || label.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55 dark:text-white/50">
          {label}
        </div>
        <div className="mt-1 text-lg font-semibold text-ink dark:text-white">{value}</div>
      </div>
    </a>
  );
};

export default function ContactPage() {
  return (
    <>
      <Section eyebrow="Contact" title="Get in touch">
        <div className="max-w-3xl">
          <p className="muted text-lg">
            Choose your preferred channel. We typically respond within two business days.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
